var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{
        'header': 1
    }, {
        'header': 2
    }], // custom button values
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }],
    [{
        'script': 'sub'
    }, {
        'script': 'super'
    }], // superscript/subscript
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }], // outdent/indent
    [{
        'direction': 'rtl'
    }], // text direction

    [{
        'size': ['small', false, 'large', 'huge']
    }], // custom dropdown
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }],

    [{
        'color': []
    }, {
        'background': []
    }], // dropdown with defaults from theme
    [{
        'font': []
    }],
    [{
        'align': []
    }],

    [
        'image', 'video', 'link'
    ],
    ['clean'] // remove formatting button
];

var quill = new Quill('#editor-container', {
    modules: {
        formula: false,
        syntax: false,
        // toolbar: '#toolbar-container'
        // toolbar: [
        //     [{
        //         header: [1, 2, false]
        //     }],
        //     ['bold', 'italic', 'underline'],
        //     ['image', 'code-block']
        // ]
        toolbar: toolbarOptions

    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
});

function saveAttributeSets(elem) {
    console.log(elem);

    var content = quill.getContents();
    console.log(content)
}
