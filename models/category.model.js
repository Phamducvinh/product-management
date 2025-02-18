const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema({
    title: String,
    parent_id: {
        type: String,
        default: ""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { 
        type: String, 
        slug: "title", 
        unique: true 
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        },
    ],
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;