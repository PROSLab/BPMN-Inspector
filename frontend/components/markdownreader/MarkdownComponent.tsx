import React from 'react';
import ReactMarkdown from 'react-markdown';

// @ts-ignore
const MarkdownComponent = ({ markdownContent }) => {
    return <ReactMarkdown>{markdownContent}</ReactMarkdown>;
};

export default MarkdownComponent;
