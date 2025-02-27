let base64Image = "";
let generatedFrames = new Set();
let countFramesToGenerate = 0;

function handleImageClick(clickedImg) {
    clickedImg.classList.toggle('active');
}

var params = {
    apiKey: 'TEST',
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
    container.className = "col-md-6";

   /* const eanText = document.createElement("p");
    eanText.innerText = "EAN: " + ean;
    eanText.style.textAlign = "center";*/

    // Create the image element
    const imgElement = document.createElement("img");
    imgElement.src = data.data;
    imgElement.className = "img-fluid imgResult";

    const downloadBtn = document.createElement("a");
    downloadBtn.innerText = "Stáhnout";
    downloadBtn.style.textAlign = "center";
    downloadBtn.download = ean + ".jpg";
    downloadBtn.href = data.data;

    downloadBtn.addEventListener("click", function() {
        downloadBtn.classList.add("red");
    });


    //container.appendChild(eanText);
    container.appendChild(imgElement);
    container.appendChild(downloadBtn);

    document.getElementById("result").appendChild(container);
}


document.getElementById("generate").addEventListener("click", async function () {
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

        countFramesToGenerate += selectedFrames.length; // Zvýšení počtu generovaných obrázků
        console.log("Počet obrázků k vygenerování: " + countFramesToGenerate);

        // Přidání placeholderů
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
    } else {
        alert("Nejprve nahrajte fotografii.");
    }
});

function generateFrame(frame) {
    return new Promise((resolve) => {
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
        placeholder.innerHTML = '<span class="sr-only">Generuji...</span><div class="spinner-border text-primary" role="status"></div>';
        loadingImagesContainer.appendChild(placeholder);
    }
}

function removeLoadingPlaceholder() {
    const loadingImagesContainer = document.getElementById("result");
    if (loadingImagesContainer.children.length > 0) {
        loadingImagesContainer.removeChild(loadingImagesContainer.children[0]);
    }
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

// Glasses
$(document).ready(function () {
    const data = {
        "rectangular": [
            {"src": "images/0886895624275.jpeg", "ean": "0886895624275"},
            {"src": "images/886895588775.jpeg", "ean": "886895588775"},
            {"src": "images/0886895497794.jpeg", "ean": "0886895497794"}
        ],
        "oval": [
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "8053672909258"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "0888392486523"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "8056597233958"}
        ],
        "square": [
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1234567892"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "9876543212"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1122334452"}
        ],
        "round": [
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1234567893"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "9876543213"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1122334453"}
        ],
        "aviator": [
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1234567894"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "9876543214"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1122334454"}
        ],
        "cat-eye": [
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1234567895"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "9876543215"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1122334455"}
        ],
        "wayfarer": [
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1234567896"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "9876543216"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1122334456"}
        ],
        "oversize": [
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1234567897"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "9876543217"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "1122334457"}
        ]
    };
    // Set data to HTML
    $.each(data, function (key, value) {
        const galleryId = "#gal-" + key;
        const $gallery = $(galleryId + " .row.row-cols-12");
        if ($gallery.length) {
            $gallery.empty();
            $.each(value, function (index, image) {
                const $col = $("<div>").addClass("col-md-3");
                const $img = $("<img>")
                    .attr("src", image.src)
                    .addClass("img-fluid gallery-img")
                    .attr("data-ean", image.ean)
                    .attr("onclick", "handleImageClick(this)");
                $col.append($img);
                $gallery.append($col);
            });
        } else {
            console.error("Galerie s ID " + galleryId + " nebyla nalezena.");
        }
    });
});