<?php
/**
 * TinyLearn LMS - Health Check Script
 * Run: php health-check.php
 */

echo "\n";
echo "========================================\n";
echo "TinyLearn LMS - Health Check\n";
echo "========================================\n\n";

$checks = [];

// 1. PHP Version
echo "[1/8] Checking PHP version...\n";
$phpVersion = phpversion();
if (version_compare($phpVersion, '8.1.0', '>=')) {
    echo "✓ PHP $phpVersion (OK)\n";
    $checks['php'] = true;
} else {
    echo "✗ PHP $phpVersion (Requires 8.1+)\n";
    $checks['php'] = false;
}

echo "\n";

// 2. Required Extensions
echo "[2/8] Checking required PHP extensions...\n";
$extensions = ['pdo', 'pdo_mysql', 'json', 'curl', 'mbstring', 'openssl'];
$allExtensionsLoaded = true;
foreach ($extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "✓ $ext\n";
    } else {
        echo "✗ $ext (NOT loaded)\n";
        $allExtensionsLoaded = false;
    }
}
$checks['extensions'] = $allExtensionsLoaded;

echo "\n";

// 3. Environment File
echo "[3/8] Checking environment configuration...\n";
if (file_exists('.env')) {
    echo "✓ .env file exists\n";
    $checks['env'] = true;
} else {
    echo "✗ .env file NOT found\n";
    $checks['env'] = false;
}

echo "\n";

// 4. Database Configuration
echo "[4/8] Checking database configuration...\n";
if (file_exists('.env')) {
    $env = parse_ini_file('.env');
    $dbConnection = $env['DB_CONNECTION'] ?? 'unknown';
    $dbHost = $env['DB_HOST'] ?? 'unknown';
    $dbDatabase = $env['DB_DATABASE'] ?? 'unknown';
    
    echo "Database Type: $dbConnection\n";
    echo "Host: $dbHost\n";
    echo "Database: $dbDatabase\n";
    
    // Try to connect
    try {
        if ($dbConnection === 'mysql') {
            $pdo = new PDO(
                "mysql:host=$dbHost",
                $env['DB_USERNAME'] ?? 'root',
                $env['DB_PASSWORD'] ?? ''
            );
            echo "✓ Database connection successful\n";
            $checks['database'] = true;
        } else {
            echo "ℹ Database type: $dbConnection\n";
            $checks['database'] = true;
        }
    } catch (Exception $e) {
        echo "✗ Database connection failed: " . $e->getMessage() . "\n";
        $checks['database'] = false;
    }
} else {
    echo "✗ Cannot check database (no .env file)\n";
    $checks['database'] = false;
}

echo "\n";

// 5. Composer Dependencies
echo "[5/8] Checking Composer dependencies...\n";
if (file_exists('vendor/autoload.php')) {
    echo "✓ Composer dependencies installed\n";
    $checks['composer'] = true;
} else {
    echo "✗ Composer dependencies NOT installed\n";
    echo "  Run: composer install\n";
    $checks['composer'] = false;
}

echo "\n";

// 6. Storage Permissions
echo "[6/8] Checking storage permissions...\n";
$storagePath = 'storage';
if (is_writable($storagePath)) {
    echo "✓ Storage directory is writable\n";
    $checks['storage'] = true;
} else {
    echo "✗ Storage directory is NOT writable\n";
    $checks['storage'] = false;
}

echo "\n";

// 7. Bootstrap Cache
echo "[7/8] Checking bootstrap cache...\n";
$bootstrapPath = 'bootstrap/cache';
if (is_dir($bootstrapPath) && is_writable($bootstrapPath)) {
    echo "✓ Bootstrap cache directory is writable\n";
    $checks['bootstrap'] = true;
} else {
    echo "✗ Bootstrap cache directory is NOT writable\n";
    $checks['bootstrap'] = false;
}

echo "\n";

// 8. Frontend Setup
echo "[8/8] Checking frontend setup...\n";
if (file_exists('react/.env')) {
    echo "✓ Frontend .env exists\n";
    $checks['frontend'] = true;
} else {
    echo "✗ Frontend .env NOT found\n";
    $checks['frontend'] = false;
}

if (file_exists('react/node_modules')) {
    echo "✓ Frontend dependencies installed\n";
} else {
    echo "ℹ Frontend dependencies not installed\n";
    echo "  Run: cd react && npm install\n";
}

echo "\n";

// Summary
echo "========================================\n";
$passedChecks = count(array_filter($checks));
$totalChecks = count($checks);

if ($passedChecks === $totalChecks) {
    echo "✓ All checks passed! ($passedChecks/$totalChecks)\n";
    echo "========================================\n\n";
    echo "Next steps:\n";
    echo "1. Run: php artisan migrate:fresh --seed\n";
    echo "2. Run: php artisan serve\n";
    echo "3. In another terminal: cd react && npm run dev\n";
    echo "\n";
    exit(0);
} else {
    echo "✗ Some checks failed! ($passedChecks/$totalChecks)\n";
    echo "========================================\n\n";
    echo "Failed checks:\n";
    foreach ($checks as $check => $passed) {
        if (!$passed) {
            echo "  - $check\n";
        }
    }
    echo "\n";
    exit(1);
}
