"use client"
import React, { useState, useEffect} from 'react';
import './articles.css';
import articles from './articles.json';
interface Article {
    id: number;
    title: string;
    author: string;
    date: string;
    content: string;
}

export default function Articles() {
    const [ selectedArticle, setSelectedArticle ] = useState<Article | null>(null);

    useEffect(() => {
    document.body.style.overflow = selectedArticle ? 'hidden' : '';

    return () => {
        document.body.style.overflow = '';
    };
    }, [selectedArticle]);

    return (
        <div className="articles-container">

            <div className="page-title">
                <div className="title-name">Finance Literacy</div>
                <div className="title-desc">
                    What is overdraft? How to manage your credit score? Worry not! In this section 
                    we combined several articles that will help you manage your finances - the best
                    read for anybody who wants to spend their money wisely.
                </div>
            </div>

            <div className="articles">
                {
                    articles.map(article => (
                        <div 
                        key = {article.id}
                        className = "article-instance"
                        onClick = {() => setSelectedArticle(article)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key == ' '){
                                e.preventDefault()
                                setSelectedArticle(article)
                            }
                        }} 
                            >

                            <h3>{article.title}</h3>
                            <h4>{article.author}, {article.date}</h4>
                            <p className="article-preview">{article.content}</p>
                            <span className="read-more">
                                Read more →
                            </span>
                        </div>
                    ))}
            </div>


            {selectedArticle && (
                <div
                    className="article-overlay"
                    onClick={() => setSelectedArticle(null)}
                >
                    <div
                        className="article-popup"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedArticle.title}
                    >
                        <button
                            className="close-popup"
                            onClick={() => setSelectedArticle(null)}
                            aria-label="Close article"
                        >
                            &times;
                        </button>

                        <h2>{selectedArticle.title}</h2>

                        <h4>
                            {selectedArticle.author}, {selectedArticle.date}
                        </h4>

                        <div className="popup-content">
                            {selectedArticle.content}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}