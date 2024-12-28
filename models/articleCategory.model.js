const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const articleCategorySchema = new mongoose.Schema({
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
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    deletedAt: Date,
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        },
    ],
});

const ArticleCategory = mongoose.model('ArticleCategory', articleCategorySchema, 'article_categories');

module.exports = ArticleCategory;