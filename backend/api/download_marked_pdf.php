<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

// Require Composer autoload (install FPDI first)
require_once __DIR__ . '/../vendor/autoload.php';
use setasign\Fpdi\Fpdi;

$project_id = (int) ($_GET['project_id'] ?? 0);
if (!$project_id)
  sendJSON(['error' => 'Project ID required'], 400);

// Get file info
$stmt = $conn->prepare("SELECT pf.file_path, pf.file_name FROM project_files pf WHERE pf.project_id = ? LIMIT 1");
$stmt->bind_param("i", $project_id);
$stmt->execute();
$file = $stmt->get_result()->fetch_assoc();
if (!$file)
  sendJSON(['error' => 'No file found for this project'], 404);

$originalPath = __DIR__ . '/../uploads/' . $file['file_path'];
if (!file_exists($originalPath))
  sendJSON(['error' => 'File not found'], 404);

// Fetch pending errors
$errStmt = $conn->prepare("SELECT original_text, suggested_text, line_number FROM file_errors WHERE project_id = ? AND status = 'pending' ORDER BY line_number ASC");
$errStmt->bind_param("i", $project_id);
$errStmt->execute();
$errors = $errStmt->get_result()->fetch_all(MYSQLI_ASSOC);

if (empty($errors)) {
  header('Content-Type: application/pdf');
  header('Content-Disposition: attachment; filename="' . $file['file_name'] . '"');
  readfile($originalPath);
  exit;
}

$pdf = new Fpdi();
$pageCount = $pdf->setSourceFile($originalPath);

// Group errors by page number (line_number used as page number)
$errorsByPage = [];
foreach ($errors as $err) {
  $page = (int) $err['line_number'];
  if ($page < 1)
    $page = 1;
  if (!isset($errorsByPage[$page]))
    $errorsByPage[$page] = [];
  $errorsByPage[$page][] = $err;
}

for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
  $templateId = $pdf->importPage($pageNo);
  $size = $pdf->getTemplateSize($templateId);
  $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
  $pdf->useTemplate($templateId);

  if (isset($errorsByPage[$pageNo])) {
    $y = 40; // starting Y position (adjust as needed)
    $step = 25;
    foreach ($errorsByPage[$pageNo] as $err) {
      // Draw red rounded rectangle
      $pdf->SetDrawColor(255, 0, 0);
      $pdf->SetLineWidth(1);
      $pdf->Rect(70, $y, 60, 12, 'D');  // simple rectangle as circle substitute

      // Add text
      $pdf->SetFont('Helvetica', 'B', 9);
      $pdf->SetTextColor(255, 0, 0);
      $correction = "✘ " . $err['original_text'] . " → " . $err['suggested_text'];
      $pdf->Text(72, $y + 8, $correction);
      $y += $step;
    }
  }
}

$markedFileName = 'marked_' . $file['file_name'];
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $markedFileName . '"');
$pdf->Output('I');
exit;
?>