 var system = [{
     "data-controlType": "text",
     "attributes": {
         "required": "true",
         "displayGroup": "system",
         "describe": "Display Name",
         "placeholder": "Product Name",
         "label": "Product Name",
         "id": "sysProductName"
     }
 }, {
     "data-controlType": "text",
     "attributes": {
         "required": "true",
         "displayGroup": "system",
         "describe": "Custom SKU",
         "placeholder": "Custom SKU",
         "label": "Custom SKU",
         "id": "sysCustomSKU"
     }
 }, {
     "data-controlType": "number",
     "attributes": {
         "required": "true",
         "max": "",
         "min": "",
         "describe": "Base Price",
         "displayGroup": "system",
         "placeholder": "Base Price",
         "label": "Base Price",
         "id": "sysBasePrice"
     }
 }, {
     "data-controlType": "number",
     "attributes": {
         "required": "true",
         "max": "",
         "min": "",
         "describe": "Current Price",
         "displayGroup": "system",
         "placeholder": "Current Price",
         "label": "CurrentPrice",
         "id": "sysCurrentPrice"
     }
 }, {
     "data-controlType": "select_tags",
     "attributes": {
         "id": "sysCategories",
         "label": "Categories",
         "describe": "Cat color",
         "options": "Ginggle\nGray\nBlack\nWhite\nZebra\nYellow\n...More\n",
         "displayGroup": "system",
         "required": "true"
     }
 }, {
     "data-controlType": "select_tags",
     "attributes": {
         "id": "sysBranchName",
         "label": "Branch Name",
         "describe": "Branch Name",
         "options": "Ginggle\nGray\nBlack\nWhite\nZebra\nYellow\n...More\n",
         "displayGroup": "system",
         "required": "false"
     }
 }]

 module.exports = system;
