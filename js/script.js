let base64Image = "";
let generatedFrames = new Set();
let countFramesToGenerate = 0;
let isGenerating = false;

function handleImageClick(clickedImg) {
    if (!isGenerating) {
        clickedImg.classList.toggle('active');
    }
}

document.getElementById("pdSlider").addEventListener("input", function () {
    document.getElementById("pdValue").innerText = this.value;
});

var params = {
    apiKey: 'X2jYvgRy7LnBexatVDTHYwGr3Ojh0RDrvOyKkbXT',
    onStopVto: hide,
    onAgreePrivacyTerms: hide,
    onPhotoRender: (data) => {
        showRendered(data);
        decreaseFrameCount();
    },
    dataPrivacyDisclaimerTexts: {}
};

window.onload = function () {
    window.fitmixInstance = FitMix.createWidget('fitmix-container', params, function () {
        openVto();
        var data = {
            liveCameraAccessDenied: true,
            livePhotoButton: false,
            photoLiveButton: false,
            photoWelcomeScreen: true,
        };
        fitmixInstance.setUiConfiguration(data);
    });
};

const fitmix = document.getElementById("fitmix-container");

function hide() {
    fitmix.style.display = 'none';
}

function show() {
    fitmix.style.display = 'block';
}

function openVto() {
    fitmixInstance.startVto('photo');
}

function stopVto() {
    fitmixInstance.stopVto();
}

function showRendered(data, ean) {
    if (!data.data || data.data.trim() === "") {
        console.log("No src provided: data.data is null or blank.");
        return;
    }

    const container = document.createElement("div");
    container.className = "col-md-4 col-xxl-4 col-xl-6";

    const imgElement = document.createElement("img");
    imgElement.src = data.data;
    imgElement.className = "img-fluid imgResult mt-3 mb-3 p-2";

    const downloadBtn = document.createElement("a");
    downloadBtn.innerText = "Stáhnout";
    downloadBtn.style.textAlign = "center";
    downloadBtn.download = ean + ".jpg";
    downloadBtn.href = data.data;
    downloadBtn.className = "btn btn-success w-100 mt-3";

    downloadBtn.addEventListener("click", function () {
        downloadBtn.classList.add("btn-danger");
        downloadBtn.classList.remove("btn-success");
    });

    container.appendChild(imgElement);
    container.appendChild(downloadBtn);

    document.getElementById("result").appendChild(container);
}

document.getElementById("generate").addEventListener("click", async function () {
    if (isGenerating) {
        alert("Generování již probíhá. Počkejte, prosím.");
        return;
    }

    if (base64Image) {
        const selectedFrames = [];
        document.querySelectorAll('.gallery-img.active').forEach(img => {
            const ean = $(img).data("ean");
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

        for (const frame of selectedFrames) {
            await generateFrame(frame);
            generatedFrames.add(frame);

            document.querySelectorAll('.gallery-img').forEach(img => {
                if ($(img).data("ean") === frame) {
                    $(img).parent().hide(300);
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
    const pdValue = document.getElementById("pdSlider").value;
    return new Promise((resolve) => {
        fitmixInstance.setPupillaryDistance(parseInt(pdValue));
        fitmixInstance.setFrame([frame]);
        fitmixInstance.setTryonPicture(base64Image);

        params.onPhotoRender = (data) => {
            showRendered(data, frame);
            decreaseFrameCount();
            resolve();
        };
    });
}

function addLoadingPlaceholders(count) {
    const loadingImagesContainer = document.getElementById("result");
    for (let i = 0; i < count; i++) {
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        placeholder.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';
        loadingImagesContainer.appendChild(placeholder);
    }
}

function removeLoadingPlaceholder() {
    const loadingImagesContainer = document.getElementById("result");
    const placeholders = loadingImagesContainer.querySelectorAll('.loading-placeholder');
    if (placeholders.length > 0) {
        loadingImagesContainer.removeChild(placeholders[0]);
    }
}

function clearPlaceholders() {
    const loadingImagesContainer = document.getElementById("result");
    const placeholders = loadingImagesContainer.querySelectorAll('.loading-placeholder');
    placeholders.forEach(placeholder => {
        loadingImagesContainer.removeChild(placeholder);
    });
}

function decreaseFrameCount() {
    if (countFramesToGenerate > 0) {
        countFramesToGenerate--;
        console.log("Počet obrázků k vygenerování: " + countFramesToGenerate);
        removeLoadingPlaceholder();
    }
}

function convertToBase64() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    if (file) {
        reader.readAsDataURL(file);
        reader.onload = function () {
            base64Image = reader.result;

            const imgElement = document.createElement("img");
            imgElement.src = base64Image;
            imgElement.className = "img-fluid imgPreview";

            document.getElementById("preview").appendChild(imgElement);

            $('#glassResult').hide();
            $('#glass-selector').show(200);
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
            betterData = data.map(({ean, name, gender}) => ({ean, name, gender}));
        }

        return betterData;
    }

    let selectedType = null;
    document.getElementById("type-select").addEventListener("change", function () {
        selectedType = this.value;
        filterGlasses(selectedType);
    });

    async function filterGlasses(type) {
        const data = await refactorData();
        const glassesListContainer = $('#glasses-list');
        glassesListContainer.empty();

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
                glassesListContainer.append(html);
            }
        });
    }

    filterGlasses(selectedType);
});

$("#toTop").click(function () {
    $("html, body").animate({scrollTop: 0}, 500);
});