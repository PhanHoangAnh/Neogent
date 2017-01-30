var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var Shop_schema = new Schema({
    _id: Schema.Types.ObjectId,
    fb_uid: { type: String, unique: true, required: true, dropDups: true, index: true },
    members: [Schema.Types.Mixed],
    avatars: { type: String },
    walls: [String],
    longitude: { type: String },
    latitude: { type: String },
    shopname: { type: String, unique: true, required: true, dropDups: true, index: true },
    showName: { type: String },
    slogan: { type: String },
    companyName: { type: String },
    static_content: [Schema.Types.Mixed],
    contact_phone: { type: Number },
    contact_email: { type: String },
    address: { type: String },
    updated: { type: Date, default: Date.now },
    items: [Schema.Types.Mixed],
    categories: [Schema.Types.Mixed],
    catGroups: [Schema.Types.Mixed],
    brandNames: [Schema.Types.Mixed],
    collections: [Schema.Types.Mixed],
    extends: [Schema.Types.Mixed],
});

var Option_Sets = new Schema({
    setName: { type: String },
    scope: { type: String, required: true },
    components: [Schema.Types.Mixed],
    shopName: { type: String, required: true },
    icon: { type: String, default: "none" }
});

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
    console.log("Database connected..ready to use");
});

mongoose.connect(database);

exports.Shops = mongoose.model('Shops', Shop_schema);
exports.OptionSets = mongoose.model("OptionSets", Option_Sets);
