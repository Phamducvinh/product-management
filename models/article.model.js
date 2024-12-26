const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const articleSchema = new mongoose.Schema({
    title: String,
    slug: { 
        type: String, 
        slug: "title", 
        unique: true 
    },
    content: String,
    description: String,
    article_Category_id: { 
        type: String,
        default: "" 
    },
    author: String,
    thumbnail: String,
    status: String,
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date 
    },
    publishedAt: {
        type: Date 
    },
});

const Article = mongoose.model('Article', articleSchema, 'articles');

module.exports = Article;
