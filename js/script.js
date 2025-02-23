let base64Image = "";
let generatedFrames = new Set();

function handleImageClick(clickedImg) {
    clickedImg.classList.toggle('active');
}

var params = {
    apiKey: 'X2jYvgRy7LnBexatVDTHYwGr3Ojh0RDrvOyKkbXT',
    onStopVto: hide,
    onAgreePrivacyTerms: hide,
    onPhotoRender: (data) => {
        showRendered(data);
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

function showRendered(data) {
    $("#result").append('<li><img src="' + data.data + '" width="300px" /></li>');
}

// Generate BTN
document.getElementById("generate").addEventListener("click", function () {
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

        selectedFrames.forEach(frame => {
            fitmixInstance.setFrame([frame]);
            fitmixInstance.setTryonPicture(base64Image);
            generatedFrames.add(frame);

            document.querySelectorAll('.gallery-img').forEach(img => {
                if ($(img).data("ean") === frame) {
                    img.style.display = 'none';
                }
            });
        });
    } else {
        alert("Nejprve nahrajte fotografii.");
    }
});

function convertToBase64() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    if (file) {
        reader.readAsDataURL(file);
        reader.onload = function () {
            base64Image = reader.result;
            document.getElementById('base64Output').innerText = "Fotografie nahrána.";
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
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "0886895597807"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "0888392486523"},
            {"src": "https://eshop.doktorklain.cz/files/106040_size3.webp", "ean": "8056597233958"}
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
                const $col = $("<div>").addClass("col");
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
