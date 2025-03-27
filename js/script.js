let base64Image = "";
let generatedFrames = new Set();
let countFramesToGenerate = 0;
let isGenerating = false;

function handleImageClick(clickedImg) {
    if (!isGenerating) {
        $(clickedImg).toggleClass('active');
    }
}

$("#pdSlider").on("input", function () {
    $("#pdValue").text($(this).val());
});

var params = {
    apiKey: 'X2jYvgRy7LnBexatVDTHYwGr3Ojh0RDrvOyKkbXT',
    onStopVto: hide,
    onAgreePrivacyTerms: hide,
    onPhotoRender: function (data) {
        showRendered(data);
        decreaseFrameCount();
    },
    dataPrivacyDisclaimerTexts: {}
};

$(window).on("load", function () {
    window.fitmixInstance = FitMix.createWidget('fitmix-container', params, function () {
        openVto();
        let data = {
            liveCameraAccessDenied: true,
            livePhotoButton: false,
            photoLiveButton: false,
            photoWelcomeScreen: true,
        };
        fitmixInstance.setUiConfiguration(data);
    });
});

function hide() {
    $("#fitmix-container").hide();
}

function show() {
    $("#fitmix-container").show();
}

function openVto() {
    fitmixInstance.startVto('photo');
}

function stopVto() {
    fitmixInstance.stopVto();
}

function showRendered(data, ean) {
    if (!data.data || $.trim(data.data) === "") {
        console.log("No src provided: data.data is null or blank.");
        return;
    }

    let $container = $("<div>").addClass("col-md-4 col-xxl-4 col-xl-6");
    let $imgElement = $("<img>").attr("src", data.data)
                                .addClass("img-fluid imgResult mt-3 mb-3 p-2");

    let $downloadBtn = $("<a>")
        .text("Stáhnout")
        .css("text-align", "center")
        .attr({ download: ean + ".jpg", href: data.data })
        .addClass("btn btn-success w-100 mt-3");

    $downloadBtn.on("click", function () {
        $(this).removeClass("btn-success").addClass("btn-danger");
    });

    $container.append($imgElement, $downloadBtn);
    $("#result").append($container);
}

$("#generate").on("click", async function () {
    if (isGenerating) {
        alert("Generování již probíhá. Počkejte, prosím.");
        return;
    }

    if (base64Image) {
        let selectedFrames = [];
        $(".gallery-img.active").each(function () {
            let ean = $(this).data("ean");
            if (!generatedFrames.has(ean)) {
                selectedFrames.push(ean);
            }
        });

        if (selectedFrames.length === 0) {
            alert("Vyberte alespoň jedny brýle, které ještě nebyly vygenerovány.");
            return;
        }

        isGenerating = true;
        countFramesToGenerate += selectedFrames.length;

        addLoadingPlaceholders(selectedFrames.length);

        for (let frame of selectedFrames) {
            await generateFrame(frame);
            generatedFrames.add(frame);

            $(".gallery-img").each(function () {
                if ($(this).data("ean") === frame) {
                    $(this).parent().hide(300);
                }
            });
        }

        isGenerating = false;
        if (countFramesToGenerate === 0) {
            clearPlaceholders();
        }
    } else {
        alert("Nejprve nahrajte fotografii.");
    }
});

function generateFrame(frame) {
    let pdValue = $("#pdSlider").val();
    return new Promise((resolve) => {
        fitmixInstance.setPupillaryDistance(parseInt(pdValue));
        fitmixInstance.setFrame([frame]);
        fitmixInstance.setTryonPicture(base64Image);

        params.onPhotoRender = function (data) {
            showRendered(data, frame);
            decreaseFrameCount();
            resolve();
        };
    });
}

function addLoadingPlaceholders(count) {
    let $loadingImagesContainer = $("#result");
    for (let i = 0; i < count; i++) {
        let $placeholder = $("<div>")
            .addClass("loading-placeholder")
            .html('<div class="spinner-border text-primary" role="status"></div>');
        $loadingImagesContainer.append($placeholder);
    }
}

function removeLoadingPlaceholder() {
    let $placeholders = $("#result .loading-placeholder");
    if ($placeholders.length > 0) {
        $placeholders.first().remove();
    }
}

function clearPlaceholders() {
    $("#result .loading-placeholder").remove();
}

function decreaseFrameCount() {
    if (countFramesToGenerate > 0) {
        countFramesToGenerate--;
        console.log("Počet obrázků k vygenerování: " + countFramesToGenerate);
        removeLoadingPlaceholder();
    }
}

function convertToBase64() {
    let file = $('#fileInput')[0].files[0];
    let reader = new FileReader();

    if (file) {
        reader.readAsDataURL(file);
        reader.onload = function () {
            base64Image = reader.result;

            let $imgElement = $("<img>")
                .attr("src", base64Image)
                .addClass("img-fluid imgPreview");

            $("#preview").append($imgElement);

            $("#glassResult").hide();
            $("#glass-selector").show(200);
        };
        reader.onerror = function (error) {
            console.error("Chyba při čtení souboru:", error);
        };
    }
}

$(document).ready(function () {
    async function getData() {
        try {
            const response = await fetch("./data/data.csv");
            const csvText = await response.text();

            return new Promise((resolve) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: header => header.trim().toLowerCase(),
                    complete: function (results) {
                        resolve(results.data);
                    }
                });
            });
        } catch (error) {
            console.error("Chyba při načítání CSV souboru:", error);
            return [];
        }
    }

    async function refactorData() {
        const data = await getData();
        let betterData = [];

        if (data.length > 0) {
            betterData = data.map(({ ean, name, gender }) => ({ ean, name, gender }));
        }

        return betterData;
    }

    let selectedType = null;
    $("#type-select").on("change", function () {
        selectedType = $(this).val();
        filterGlasses(selectedType);
    });

    async function filterGlasses(type) {
        const data = await refactorData();
        const $glassesListContainer = $('#glasses-list');
        $glassesListContainer.empty();

        $(data).each(function (index, value) {
            let src = "img/" + value.name;
            if (value.gender === type || type === null || type === "all") {
                const html = `
                    <div class="col-md-3">
                        <div class="card">
                            <img src="${src}" class="card-img-top img-fluid gallery-img" alt="${value.name}" 
                                 data-ean="${value.ean}" onclick="handleImageClick(this)">
                        </div>
                    </div>
                `;
                $glassesListContainer.append(html);
            }
        });
    }

    filterGlasses(selectedType);
});

$("#toTop").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
});
