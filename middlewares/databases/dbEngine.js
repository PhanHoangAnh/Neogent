var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var Shop_schema = new Schema({
    _id: Schema.Types.ObjectId,
    fb_uid: { type: String, unique: true, required: true, dropDups: true, index: true },
    avatars: String,
    walls: String,
    longitude: String,
    latitude: String,
    pathName: { type: String, unique: true, required: true, dropDups: true, index: true },
    showName: String,
    slogan: String,
    companyName: String,
    shop_description: String,
    contact_phone: String,
    contact_email: String,
    address: String,
    uid: [String],
    updated: { type: Date, default: Date.now },
    items: [Schema.Types.Mixed],
    categories: [Schema.Types.Mixed],
    extends: [Schema.Types.Mixed],
});

var Option_Sets = new Schema({
    setName: { type: String },
    scope: { type: String, required: true },
    components: [Schema.Types.Mixed],
    shopName: { type: String, required: true },
    icon :{type:String, default: "none"}
});

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.    
});

mongoose.connect(database);

exports.Shops = mongoose.model('Shops', Shop_schema);
exports.OptionSets = mongoose.model("OptionSets", Option_Sets);
