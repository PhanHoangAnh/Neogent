var assert = require("assert");

var mockObj = [{
        "productAtttributes": [{
                "InputValue": "chipl",
                "attributes": {
                    "sysId": "sysProductName",
                    "label": "Product Name",
                    "placeholder": "Product Name",
                    "describe": "Display Name",
                    "displayGroup": "system",
                    "required": "true"
                },
                "data-controlType": "text"
            },
            {
                "InputValue": "abcd",
                "attributes": {
                    "sysId": "sysCustomSKU",
                    "label": "Custom SKU",
                    "placeholder": "Custom SKU",
                    "describe": "Custom SKU",
                    "displayGroup": "system",
                    "required": "true"
                },
                "data-controlType": "text"
            },
            {
                "InputValue": "1234",
                "attributes": {
                    "sysId": "sysBasePrice",
                    "label": "Base Price",
                    "placeholder": "Base Price",
                    "displayGroup": "system",
                    "describe": "Base Price",
                    "min": "",
                    "max": "",
                    "required": "true"
                },
                "data-controlType": "number"
            },
            {
                "InputValue": "1234",
                "attributes": {
                    "sysId": "sysCurrentPrice",
                    "label": "Current Price",
                    "placeholder": "Current Price",
                    "displayGroup": "system",
                    "describe": "Current Price",
                    "min": "",
                    "max": "",
                    "required": "true"
                },
                "data-controlType": "number"
            },
            {
                "InputValue": [
                    "mèo"
                ],
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "options": [
                        "mèo",
                        "gà"
                    ],
                    "describe": "Cat color",
                    "label": "Categories",
                    "sysId": "sysCategories"
                },
                "data-controlType": "select_tags"
            },
            {
                "InputValue": [
                    "chó"
                ],
                "attributes": {
                    "required": "false",
                    "displayGroup": "system",
                    "options": [
                        "cún",
                        "chó"
                    ],
                    "describe": "Brand Name",
                    "label": "Brand Name",
                    "sysId": "sysBrandName"
                },
                "data-controlType": "select_tag_single"
            },
            {
                "InputValue": "Gray",
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow"
                    ],
                    "describe": "Branch Name",
                    "label": "Currency",
                    "sysId": "sysCurrency"
                },
                "data-controlType": "select"
            },
            {
                "InputValue": [
                    "kg"
                ],
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow",
                        "kg"
                    ],
                    "describe": "Unit of Measurement",
                    "label": "Unit",
                    "sysId": "sysUnitOfMeasurement"
                },
                "data-controlType": "select_tag_single"
            },
            {
                "InputValue": "value 4",
                "data-controlType": "radio",
                "attributes": {
                    "id": "Mau sac",
                    "label": "Mau sac",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 4\nvalue 5\n",
                    "describe": "Something to choose"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbfc"
            },
            {
                "InputValue": "something stay here",
                "data-controlType": "combobox",
                "attributes": {
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 5\n",
                    "id": "Editable Combo",
                    "label": "Editable Combo",
                    "placeholder": "something"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbfd"
            },
            {
                "InputValue": [
                    "value 3"
                ],
                "data-controlType": "checkbox",
                "attributes": {
                    "id": "checkbox",
                    "label": "Checkbox",
                    "describe": "check for someone",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue test"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbfe"
            },
            {
                "InputValue": "cái gì vÁy",
                "data-controlType": "textarea",
                "attributes": {
                    "describe": "abcd",
                    "placeholder": "con vit",
                    "label": "afdsafdsa",
                    "id": "meo"
                },
                "sysId": "5853d3a2cdf6e78f2e75cc00"
            },
            {
                "InputValue": {
                    "value": "0",
                    "attImgYRatio": "1",
                    "attImgXRatio": "1",
                    "optName": "alice",
                    "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png"
                },
                "data-controlType": "ImageOptions",
                "attributes": {
                    "ImageOptions": [{
                            "value": "0",
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "alice",
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png"
                        },
                        {
                            "value": "1",
                            "optName": "beauty",
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_4.png"
                        },
                        {
                            "value": "5",
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "hung",
                            "img": "convit/imgs/5853d32ccdf6e78f2e75cbe5_5.png"
                        }
                    ],
                    "id": "ImageOptions",
                    "label": "Image Options",
                    "describe": "something"
                },
                "sysId": "5853d3a2cdf6e78f2e75cc01"
            },
            {
                "InputValue": {
                    "img": "convit/imgs/5847f4b68c860d0e55189af0_3.png",
                    "optName": "gà",
                    "attImgXRatio": "1",
                    "attImgYRatio": "1",
                    "value": "3"
                },
                "data-controlType": "ImageOptions",
                "attributes": {
                    "describe": "secondOne",
                    "label": "seconImageOption",
                    "id": "seconImage",
                    "ImageOptions": [{
                            "img": "convit/imgs/5847f4b68c860d0e55189af0_3.png",
                            "optName": "gà",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1",
                            "value": "3"
                        },
                        {
                            "img": "convit/imgs/583a765813680d9718f0a957_4.png",
                            "value": "4",
                            "optName": "v­t",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1"
                        }
                    ]
                },
                "sysId": "5853d3a2cdf6e78f2e75cc02"
            },
            {
                "InputValue": "/convit/imgs/58674de9e521fe8e22be479e_5853d3a2cdf6e78f2e75cbff.png",
                "data-controlType": "image",
                "attributes": {
                    "id": "Image",
                    "label": "SomeContent",
                    "describe": "Sçn phGm",
                    "width": "16",
                    "height": "9"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbff"
            }
        ],
        "systemSKU": "58674de9e521fe8e22be479e"
    },
    {
        "productAtttributes": [{
                "InputValue": "Another 2",
                "attributes": {
                    "sysId": "sysProductName",
                    "label": "Product Name",
                    "placeholder": "Product Name",
                    "describe": "Display Name",
                    "displayGroup": "system",
                    "required": "true"
                },
                "data-controlType": "text"
            },
            {
                "InputValue": "abcd",
                "attributes": {
                    "sysId": "sysCustomSKU",
                    "label": "Custom SKU",
                    "placeholder": "Custom SKU",
                    "describe": "Custom SKU",
                    "displayGroup": "system",
                    "required": "true"
                },
                "data-controlType": "text"
            },
            {
                "InputValue": "1234",
                "attributes": {
                    "sysId": "sysBasePrice",
                    "label": "Base Price",
                    "placeholder": "Base Price",
                    "displayGroup": "system",
                    "describe": "Base Price",
                    "min": "",
                    "max": "",
                    "required": "true"
                },
                "data-controlType": "number"
            },
            {
                "InputValue": "8547",
                "attributes": {
                    "sysId": "sysCurrentPrice",
                    "label": "Current Price",
                    "placeholder": "Current Price",
                    "displayGroup": "system",
                    "describe": "Current Price",
                    "min": "",
                    "max": "",
                    "required": "true"
                },
                "data-controlType": "number"
            },
            {
                "InputValue": [
                    "mèo"
                ],
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "options": [
                        "mèo",
                        "gà"
                    ],
                    "describe": "Cat color",
                    "label": "Categories",
                    "sysId": "sysCategories"
                },
                "data-controlType": "select_tags"
            },
            {
                "InputValue": [
                    "cún"
                ],
                "attributes": {
                    "required": "false",
                    "displayGroup": "system",
                    "options": [
                        "cún",
                        "chó"
                    ],
                    "describe": "Brand Name",
                    "label": "Brand Name",
                    "sysId": "sysBrandName"
                },
                "data-controlType": "select_tag_single"
            },
            {
                "InputValue": "Gray",
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow"
                    ],
                    "describe": "Branch Name",
                    "label": "Currency",
                    "sysId": "sysCurrency"
                },
                "data-controlType": "select"
            },
            {
                "InputValue": [
                    "kg"
                ],
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow",
                        "kg"
                    ],
                    "describe": "Unit of Measurement",
                    "label": "Unit",
                    "sysId": "sysUnitOfMeasurement"
                },
                "data-controlType": "select_tag_single"
            },
            {
                "InputValue": "value 4",
                "data-controlType": "radio",
                "attributes": {
                    "id": "Mau sac",
                    "label": "Mau sac",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 4\nvalue 5\n",
                    "describe": "Something to choose"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbfc"
            },
            {
                "InputValue": "something stay here",
                "data-controlType": "combobox",
                "attributes": {
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 5\n",
                    "id": "Editable Combo",
                    "label": "Editable Combo",
                    "placeholder": "something"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbfd"
            },
            {
                "InputValue": [
                    "value 3"
                ],
                "data-controlType": "checkbox",
                "attributes": {
                    "id": "checkbox",
                    "label": "Checkbox",
                    "describe": "check for someone",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue test"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbfe"
            },
            {
                "InputValue": "cái gì vÁy",
                "data-controlType": "textarea",
                "attributes": {
                    "describe": "abcd",
                    "placeholder": "con vit",
                    "label": "afdsafdsa",
                    "id": "meo"
                },
                "sysId": "5853d3a2cdf6e78f2e75cc00"
            },
            {
                "InputValue": {
                    "value": "0",
                    "attImgYRatio": "1",
                    "attImgXRatio": "1",
                    "optName": "alice",
                    "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png"
                },
                "data-controlType": "ImageOptions",
                "attributes": {
                    "ImageOptions": [{
                            "value": "0",
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "alice",
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png"
                        },
                        {
                            "value": "1",
                            "optName": "beauty",
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_4.png"
                        },
                        {
                            "value": "5",
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "hung",
                            "img": "convit/imgs/5853d32ccdf6e78f2e75cbe5_5.png"
                        }
                    ],
                    "id": "ImageOptions",
                    "label": "Image Options",
                    "describe": "something"
                },
                "sysId": "5853d3a2cdf6e78f2e75cc01"
            },
            {
                "InputValue": {
                    "img": "convit/imgs/583a765813680d9718f0a957_4.png",
                    "value": "4",
                    "optName": "v­t",
                    "attImgXRatio": "1",
                    "attImgYRatio": "1"
                },
                "data-controlType": "ImageOptions",
                "attributes": {
                    "describe": "secondOne",
                    "label": "seconImageOption",
                    "id": "seconImage",
                    "ImageOptions": [{
                            "img": "convit/imgs/5847f4b68c860d0e55189af0_3.png",
                            "optName": "gà",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1",
                            "value": "3"
                        },
                        {
                            "img": "convit/imgs/583a765813680d9718f0a957_4.png",
                            "value": "4",
                            "optName": "v­t",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1"
                        }
                    ]
                },
                "sysId": "5853d3a2cdf6e78f2e75cc02"
            },
            {
                "InputValue": "/convit/imgs/5868c9d135effb7f09849a38_5853d3a2cdf6e78f2e75cbff.png",
                "data-controlType": "image",
                "attributes": {
                    "id": "Image",
                    "label": "SomeContent",
                    "describe": "Sçn phGm",
                    "width": "16",
                    "height": "9"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbff"
            }
        ],
        "systemSKU": "5868c9d135effb7f09849a38"
    },
    {
        "productAtttributes": [{
                "InputValue": "Another 3",
                "attributes": {
                    "sysId": "sysProductName",
                    "label": "Product Name",
                    "placeholder": "Product Name",
                    "describe": "Display Name",
                    "displayGroup": "system",
                    "required": "true"
                },
                "data-controlType": "text"
            },
            {
                "InputValue": "abcd",
                "attributes": {
                    "sysId": "sysCustomSKU",
                    "label": "Custom SKU",
                    "placeholder": "Custom SKU",
                    "describe": "Custom SKU",
                    "displayGroup": "system",
                    "required": "true"
                },
                "data-controlType": "text"
            },
            {
                "InputValue": "1234",
                "attributes": {
                    "sysId": "sysBasePrice",
                    "label": "Base Price",
                    "placeholder": "Base Price",
                    "displayGroup": "system",
                    "describe": "Base Price",
                    "min": "",
                    "max": "",
                    "required": "true"
                },
                "data-controlType": "number"
            },
            {
                "InputValue": "34567",
                "attributes": {
                    "sysId": "sysCurrentPrice",
                    "label": "Current Price",
                    "placeholder": "Current Price",
                    "displayGroup": "system",
                    "describe": "Current Price",
                    "min": "",
                    "max": "",
                    "required": "true"
                },
                "data-controlType": "number"
            },
            {
                "InputValue": [
                    "kitty"
                ],
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "options": [
                        "mèo",
                        "gà"
                    ],
                    "describe": "Cat color",
                    "label": "Categories",
                    "sysId": "sysCategories"
                },
                "data-controlType": "select_tags"
            },
            {
                "InputValue": [
                    "cún"
                ],
                "attributes": {
                    "required": "false",
                    "displayGroup": "system",
                    "options": [
                        "cún",
                        "chó"
                    ],
                    "describe": "Brand Name",
                    "label": "Brand Name",
                    "sysId": "sysBrandName"
                },
                "data-controlType": "select_tag_single"
            },
            {
                "InputValue": "Yellow",
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow"
                    ],
                    "describe": "Branch Name",
                    "label": "Currency",
                    "sysId": "sysCurrency"
                },
                "data-controlType": "select"
            },
            {
                "InputValue": [
                    "kg"
                ],
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow",
                        "kg"
                    ],
                    "describe": "Unit of Measurement",
                    "label": "Unit",
                    "sysId": "sysUnitOfMeasurement"
                },
                "data-controlType": "select_tag_single"
            },
            {
                "InputValue": "value 4",
                "data-controlType": "radio",
                "attributes": {
                    "id": "Mau sac",
                    "label": "Mau sac",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 4\nvalue 5\n",
                    "describe": "Something to choose"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbfc"
            },
            {
                "InputValue": "something stay here",
                "data-controlType": "combobox",
                "attributes": {
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 5\n",
                    "id": "Editable Combo",
                    "label": "Editable Combo",
                    "placeholder": "something"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbfd"
            },
            {
                "InputValue": [
                    "value 3"
                ],
                "data-controlType": "checkbox",
                "attributes": {
                    "id": "checkbox",
                    "label": "Checkbox",
                    "describe": "check for someone",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue test"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbfe"
            },
            {
                "InputValue": "cái gì vÁy",
                "data-controlType": "textarea",
                "attributes": {
                    "describe": "abcd",
                    "placeholder": "con vit",
                    "label": "afdsafdsa",
                    "id": "meo"
                },
                "sysId": "5853d3a2cdf6e78f2e75cc00"
            },
            {
                "InputValue": {
                    "value": "0",
                    "attImgYRatio": "1",
                    "attImgXRatio": "1",
                    "optName": "alice",
                    "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png"
                },
                "data-controlType": "ImageOptions",
                "attributes": {
                    "ImageOptions": [{
                            "value": "0",
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "alice",
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png"
                        },
                        {
                            "value": "1",
                            "optName": "beauty",
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_4.png"
                        },
                        {
                            "value": "5",
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "hung",
                            "img": "convit/imgs/5853d32ccdf6e78f2e75cbe5_5.png"
                        }
                    ],
                    "id": "ImageOptions",
                    "label": "Image Options",
                    "describe": "something"
                },
                "sysId": "5853d3a2cdf6e78f2e75cc01"
            },
            {
                "InputValue": {
                    "img": "convit/imgs/583a765813680d9718f0a957_4.png",
                    "value": "4",
                    "optName": "v­t",
                    "attImgXRatio": "1",
                    "attImgYRatio": "1"
                },
                "data-controlType": "ImageOptions",
                "attributes": {
                    "describe": "secondOne",
                    "label": "seconImageOption",
                    "id": "seconImage",
                    "ImageOptions": [{
                            "img": "convit/imgs/5847f4b68c860d0e55189af0_3.png",
                            "optName": "gà",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1",
                            "value": "3"
                        },
                        {
                            "img": "convit/imgs/583a765813680d9718f0a957_4.png",
                            "value": "4",
                            "optName": "v­t",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1"
                        }
                    ]
                },
                "sysId": "5853d3a2cdf6e78f2e75cc02"
            },
            {
                "InputValue": "/convit/imgs/5868c9ef35effb7f09849a39_5853d3a2cdf6e78f2e75cbff.png",
                "data-controlType": "image",
                "attributes": {
                    "id": "Image",
                    "label": "SomeContent",
                    "describe": "Sçn phGm",
                    "width": "16",
                    "height": "9"
                },
                "sysId": "5853d3a2cdf6e78f2e75cbff"
            }
        ],
        "systemSKU": "5868c9ef35effb7f09849a39"
    },
    {
        "systemSKU": "5868ce2f8a0e2dc80d8f39aa",
        "productAtttributes": [{
                "data-controlType": "text",
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "describe": "Display Name",
                    "placeholder": "Product Name",
                    "label": "Product Name",
                    "sysId": "sysProductName"
                },
                "InputValue": "Another"
            },
            {
                "data-controlType": "text",
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "describe": "Custom SKU",
                    "placeholder": "Custom SKU",
                    "label": "Custom SKU",
                    "sysId": "sysCustomSKU"
                },
                "InputValue": "abcd"
            },
            {
                "data-controlType": "number",
                "attributes": {
                    "required": "true",
                    "max": "",
                    "min": "",
                    "describe": "Base Price",
                    "displayGroup": "system",
                    "placeholder": "Base Price",
                    "label": "Base Price",
                    "sysId": "sysBasePrice"
                },
                "InputValue": "1234"
            },
            {
                "data-controlType": "number",
                "attributes": {
                    "required": "true",
                    "max": "",
                    "min": "",
                    "describe": "Current Price",
                    "displayGroup": "system",
                    "placeholder": "Current Price",
                    "label": "Current Price",
                    "sysId": "sysCurrentPrice"
                },
                "InputValue": "1234"
            },
            {
                "data-controlType": "select_tags",
                "attributes": {
                    "sysId": "sysCategories",
                    "label": "Categories",
                    "describe": "Cat color",
                    "options": [
                        "mèo",
                        "gà"
                    ],
                    "displayGroup": "system",
                    "required": "true"
                },
                "InputValue": [
                    "mèo"
                ]
            },
            {
                "data-controlType": "select_tag_single",
                "attributes": {
                    "sysId": "sysBrandName",
                    "label": "Brand Name",
                    "describe": "Brand Name",
                    "options": [
                        "cún",
                        "chó"
                    ],
                    "displayGroup": "system",
                    "required": "false"
                },
                "InputValue": [
                    "cún"
                ]
            },
            {
                "data-controlType": "select",
                "attributes": {
                    "sysId": "sysCurrency",
                    "label": "Currency",
                    "describe": "Branch Name",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow"
                    ],
                    "displayGroup": "system",
                    "required": "true"
                },
                "InputValue": "Gray"
            },
            {
                "data-controlType": "select_tag_single",
                "attributes": {
                    "sysId": "sysUnitOfMeasurement",
                    "label": "Unit",
                    "describe": "Unit of Measurement",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow",
                        "kg"
                    ],
                    "displayGroup": "system",
                    "required": "true"
                },
                "InputValue": [
                    "kg"
                ]
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cbfc",
                "attributes": {
                    "describe": "Something to choose",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 4\nvalue 5\n",
                    "label": "Mau sac",
                    "id": "Mau sac"
                },
                "data-controlType": "radio",
                "InputValue": "value 4"
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cbfd",
                "attributes": {
                    "placeholder": "something",
                    "label": "Editable Combo",
                    "id": "Editable Combo",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 5\n"
                },
                "data-controlType": "combobox",
                "InputValue": "something stay here"
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cbfe",
                "attributes": {
                    "options": "value 1\nvalue 2\nvalue 3\nvalue test",
                    "describe": "check for someone",
                    "label": "Checkbox",
                    "id": "checkbox"
                },
                "data-controlType": "checkbox",
                "InputValue": [
                    "value 3"
                ]
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cc00",
                "attributes": {
                    "id": "meo",
                    "label": "afdsafdsa",
                    "placeholder": "con vit",
                    "describe": "abcd"
                },
                "data-controlType": "textarea",
                "InputValue": "cái gì vÁy"
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cc01",
                "attributes": {
                    "describe": "something",
                    "label": "Image Options",
                    "id": "ImageOptions",
                    "ImageOptions": [{
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png",
                            "optName": "alice",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1",
                            "value": "0"
                        },
                        {
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_4.png",
                            "optName": "beauty",
                            "value": "1"
                        },
                        {
                            "img": "convit/imgs/5853d32ccdf6e78f2e75cbe5_5.png",
                            "optName": "hung",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1",
                            "value": "5"
                        }
                    ]
                },
                "data-controlType": "ImageOptions",
                "InputValue": {
                    "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png",
                    "optName": "alice",
                    "attImgXRatio": "1",
                    "attImgYRatio": "1",
                    "value": "0"
                }
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cc02",
                "attributes": {
                    "ImageOptions": [{
                            "value": "3",
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "gà",
                            "img": "convit/imgs/5847f4b68c860d0e55189af0_3.png"
                        },
                        {
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "v­t",
                            "value": "4",
                            "img": "convit/imgs/583a765813680d9718f0a957_4.png"
                        }
                    ],
                    "id": "seconImage",
                    "label": "seconImageOption",
                    "describe": "secondOne"
                },
                "data-controlType": "ImageOptions",
                "InputValue": {
                    "attImgYRatio": "1",
                    "attImgXRatio": "1",
                    "optName": "v­t",
                    "value": "4",
                    "img": "convit/imgs/583a765813680d9718f0a957_4.png"
                }
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cbff",
                "attributes": {
                    "height": "9",
                    "width": "16",
                    "describe": "Sçn phGm",
                    "label": "SomeContent",
                    "id": "Image"
                },
                "data-controlType": "image",
                "InputValue": "/convit/imgs/5868ce2f8a0e2dc80d8f39aa_5853d3a2cdf6e78f2e75cbff.png"
            }
        ]
    },
    {
        "systemSKU": "5868cf088a0e2dc80d8f39ac",
        "productAtttributes": [{
                "data-controlType": "text",
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "describe": "Display Name",
                    "placeholder": "Product Name",
                    "label": "Product Name",
                    "sysId": "sysProductName"
                },
                "InputValue": "Another 4"
            },
            {
                "data-controlType": "text",
                "attributes": {
                    "required": "true",
                    "displayGroup": "system",
                    "describe": "Custom SKU",
                    "placeholder": "Custom SKU",
                    "label": "Custom SKU",
                    "sysId": "sysCustomSKU"
                },
                "InputValue": "abcd"
            },
            {
                "data-controlType": "number",
                "attributes": {
                    "required": "true",
                    "max": "",
                    "min": "",
                    "describe": "Base Price",
                    "displayGroup": "system",
                    "placeholder": "Base Price",
                    "label": "Base Price",
                    "sysId": "sysBasePrice"
                },
                "InputValue": "1234"
            },
            {
                "data-controlType": "number",
                "attributes": {
                    "required": "true",
                    "max": "",
                    "min": "",
                    "describe": "Current Price",
                    "displayGroup": "system",
                    "placeholder": "Current Price",
                    "label": "Current Price",
                    "sysId": "sysCurrentPrice"
                },
                "InputValue": "1234"
            },
            {
                "data-controlType": "select_tags",
                "attributes": {
                    "sysId": "sysCategories",
                    "label": "Categories",
                    "describe": "Cat color",
                    "options": [
                        "mèo",
                        "gà"
                    ],
                    "displayGroup": "system",
                    "required": "true"
                },
                "InputValue": [
                    "mèo"
                ]
            },
            {
                "data-controlType": "select_tag_single",
                "attributes": {
                    "sysId": "sysBrandName",
                    "label": "Brand Name",
                    "describe": "Brand Name",
                    "options": [
                        "cún",
                        "chó"
                    ],
                    "displayGroup": "system",
                    "required": "false"
                },
                "InputValue": [
                    "cún"
                ]
            },
            {
                "data-controlType": "select",
                "attributes": {
                    "sysId": "sysCurrency",
                    "label": "Currency",
                    "describe": "Branch Name",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow"
                    ],
                    "displayGroup": "system",
                    "required": "true"
                },
                "InputValue": "Gray"
            },
            {
                "data-controlType": "select_tag_single",
                "attributes": {
                    "sysId": "sysUnitOfMeasurement",
                    "label": "Unit",
                    "describe": "Unit of Measurement",
                    "options": [
                        "Gingle",
                        "Gray",
                        "Black",
                        "White",
                        "Zebra",
                        "Yellow",
                        "kg"
                    ],
                    "displayGroup": "system",
                    "required": "true"
                },
                "InputValue": [
                    "kg"
                ]
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cbfc",
                "attributes": {
                    "describe": "Something to choose",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 4\nvalue 5\n",
                    "label": "Mau sac",
                    "id": "Mau sac"
                },
                "data-controlType": "radio",
                "InputValue": "value 4"
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cbfd",
                "attributes": {
                    "placeholder": "something",
                    "label": "Editable Combo",
                    "id": "Editable Combo",
                    "options": "value 1\nvalue 2\nvalue 3\nvalue 5\n"
                },
                "data-controlType": "combobox",
                "InputValue": "something stay here"
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cbfe",
                "attributes": {
                    "options": "value 1\nvalue 2\nvalue 3\nvalue test",
                    "describe": "check for someone",
                    "label": "Checkbox",
                    "id": "checkbox"
                },
                "data-controlType": "checkbox",
                "InputValue": [
                    "value 3"
                ]
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cc00",
                "attributes": {
                    "id": "meo",
                    "label": "afdsafdsa",
                    "placeholder": "con vit",
                    "describe": "abcd"
                },
                "data-controlType": "textarea",
                "InputValue": "cái gì vÁy"
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cc01",
                "attributes": {
                    "describe": "something",
                    "label": "Image Options",
                    "id": "ImageOptions",
                    "ImageOptions": [{
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png",
                            "optName": "alice",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1",
                            "value": "0"
                        },
                        {
                            "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_4.png",
                            "optName": "beauty",
                            "value": "1"
                        },
                        {
                            "img": "convit/imgs/5853d32ccdf6e78f2e75cbe5_5.png",
                            "optName": "hung",
                            "attImgXRatio": "1",
                            "attImgYRatio": "1",
                            "value": "5"
                        }
                    ]
                },
                "data-controlType": "ImageOptions",
                "InputValue": {
                    "img": "convit/imgs/583a6ee7e97d4c8a14bf1b44_3.png",
                    "optName": "alice",
                    "attImgXRatio": "1",
                    "attImgYRatio": "1",
                    "value": "0"
                }
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cc02",
                "attributes": {
                    "ImageOptions": [{
                            "value": "3",
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "gà",
                            "img": "convit/imgs/5847f4b68c860d0e55189af0_3.png"
                        },
                        {
                            "attImgYRatio": "1",
                            "attImgXRatio": "1",
                            "optName": "v­t",
                            "value": "4",
                            "img": "convit/imgs/583a765813680d9718f0a957_4.png"
                        }
                    ],
                    "id": "seconImage",
                    "label": "seconImageOption",
                    "describe": "secondOne"
                },
                "data-controlType": "ImageOptions",
                "InputValue": {
                    "attImgYRatio": "1",
                    "attImgXRatio": "1",
                    "optName": "v­t",
                    "value": "4",
                    "img": "convit/imgs/583a765813680d9718f0a957_4.png"
                }
            },
            {
                "sysId": "5853d3a2cdf6e78f2e75cbff",
                "attributes": {
                    "height": "9",
                    "width": "16",
                    "describe": "Sçn phGm",
                    "label": "SomeContent",
                    "id": "Image"
                },
                "data-controlType": "image",
                "InputValue": "/convit/imgs/5868cf088a0e2dc80d8f39ac_5853d3a2cdf6e78f2e75cbff.png"
            }
        ]
    }
]


function getFlatAtt() {
    var aggregateObj = {};

    mockObj.forEach(function (elem) {
        var atts = elem.productAtttributes;
        var tempObj = {};
        for (var i = 0; i < atts.length; i++) {
            with({
                n: i
            }) {
                if (!atts[n]["attributes"]["sysId"]) {
                    atts[n]["attributes"]["sysId"] = atts[n]["attributes"]["label"] + "_" + atts[n]["sysId"];
                }

                tempObj[atts[n]["attributes"]["sysId"]] = atts[n]["InputValue"];
                //   tempObj[atts[n]["attributes"]] = atts[n]["attributes"]["label"];
                console.log('tempObj -----------: \n ', tempObj);
                if (!aggregateObj.hasOwnProperty(atts[n]["attributes"]["sysId"])) {
                    aggregateObj[atts[n]["attributes"]["sysId"]] = [];
                };
                var InputValue = atts[n]["InputValue"];
                var property = atts[n]["attributes"]["sysId"];
                if (InputValue instanceof Array) {
                    // 1. Flattening InputValue
                    InputValue = [].concat.apply([], atts[n]["InputValue"])
                    aggregateObj[property] = aggregateObj[property].concat(InputValue.filter(function (item) {
                        return aggregateObj[property].indexOf(item) < 0;
                    }));
                    // console.log('\x1b[33m%s\x1b[0m: ', "Property: ", property, " InstanceOf Array", InputValue, aggregateObj[property]);
                } else if (aggregateObj[property].indexOf(InputValue) < 0) {
                    console.log('\x1b[33m%s\x1b[0m: ', aggregateObj[property], " IndexOf: ", aggregateObj[property].indexOf(InputValue), InputValue);
                    aggregateObj[property].push(InputValue)
                }

                console.log('\x1b[36m%s\x1b[0m', 'aggregateObj' + property + '["sysId"]] : ', aggregateObj[atts[n]["attributes"]["sysId"]]);
                console.log('\x1b[36m%s\x1b[0m', "InputValue: ", InputValue);
                //   if (aggregateObj[atts[n]["attributes"]["sysId"]].indexOf(atts[n]["InputValue"]) == -1) {
                //       aggregateObj[atts[n]["attributes"]["sysId"]].concat(InputValue);
                //       //   .filter(function (item) {
                //       //       return aggregateObj[atts[n]["attributes"]["sysId"]].indexOf(item) < 0;
                //       //   }));
                //   }
            }
        }


    });
    console.log("===============================");
    console.log(aggregateObj);

    function isEquivalent(a, b) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }


}

getFlatAtt();