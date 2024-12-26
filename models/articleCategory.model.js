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
    slug: { 
        type: String, 
        slug: "title", 
        unique: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date 
    }
});

const ArticleCategory = mongoose.model('ArticleCategory', articleCategorySchema, 'article_categories');

module.exports = ArticleCategory;