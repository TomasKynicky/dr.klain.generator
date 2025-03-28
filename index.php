<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AI stylista - Dr.Klain</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://vto-advanced-integration-api.fittingbox.com/index.js" type="text/javascript"></script>
    <link href="css/index.css?v=6" rel="stylesheet">
</head>
<body>
<main>
    <div class="container-fluid px-4 py-5">
        <a href="index.php">
            <img src="https://www.doktorklain.cz/face-logo.svg" alt="Logo Dr.Klain" class="float-start pe-3">
        </a>
            <h2 class="pb-2 border-bottom">Dr.Klain</h2>
        <div id="fitmix-container"></div>
        <div class="row" id="glassResult">
            <div class="mt-5">
                <h3 class="text-center mb-3">AI stylista</h3>
                <div class="row">
                    <div class="col border p-2">
                        <label for="type-select" class="form-label">Filtr brýlí</label>
                        <select class="form-select" name="typ" id="type-select">
                            <option value="all">Všechny</option>
                            <option value="Male">Pánské</option>
                            <option value="Female">Dámské</option>
                        </select>
                    </div>
                    <div class="col border p-2 mx-3">
                        <div id="pdSliderContainer" style="display: block;" class=" text-center">
                            <label for="pdSlider" class="form-label">Vzdálenost zornic (mm)</label>
                            <input type="range" class="form-range" id="pdSlider" min="45" max="80" value="63">
                            <p id="pdValue">63</p>
                        </div>
                    </div>
                    <div class="col border p-2">
                        <label for="fileInput" class="form-label">Vyber fotografii</label>
                        <input type="file" class="form-control" id="fileInput" accept="image/*" onchange="convertToBase64()">
                        <p class="mt-3 text-center" id="base64Output"></p>
                    </div>
                </div>
            </div>
        </div>

        <div id="preview" class="mb-5 d-flex justify-content-center">
        </div>
        <div id="result" class="row mb-5">

        </div>

        <div id="glass-selector" style="display: none;">
            <h3 class="text-center mb-3">Vyber brýle</h3>
            <div class="row mb-3 fixed-bottom p-3">
                <div class="col-md-10 d-flex align-items-center">
                    <div class="btn btn-success w-100" id="generate">Generovat</div>
                </div>
                <div class="col-md-2 d-flex align-items-center">
                    <div class="btn btn-warning w-100" id="toTop">Nahoru</div>
                </div>
            </div>
            <div class="w-100 border-bottom"></div>
            <div class="row collapse show" id="glasses">
                <div class="row row-cols-12 row-cols-md-12 g-3" id="glasses-list">

                </div>
            </div>
        </div>

</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<script src="js/script.js?v=<?php echo time();?>"></script>
</body>
</html>