<?php

$collesction_id = "1ba4e949-9290-4b1a-9e53-715e5d118b8d";
// URL API
$url = 'https://api.widencollective.com/v2/collections?type=private&expand=metadata';
//$url = 'https://api.widencollective.com/v2/assets/assetgroups';

// Inicializace cURL
$ch = curl_init($url);

// Nastavení HTTP hlaviček
$headers = [
    'Authorization: Bearer fittingbox/97973cd7b4475577be04ccec260615fb',
];

// Nastavení cURL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Odeslání požadavku
$response = curl_exec($ch);

// Kontrola chyb
if (curl_errno($ch)) {
    echo 'Chyba cURL: ' . curl_error($ch);
} else {
    // Zpracování odpovědi
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($http_code == 200) {
        $data = json_decode($response, true);
        var_dump($data);
        // Práce s daty
    } else {
        echo "Chyba: HTTP kód $http_code";
    }
}

// Uzavření cURL
curl_close($ch);
?>
