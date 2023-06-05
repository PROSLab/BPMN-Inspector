import MarkdownComponent from "Frontend/components/markdownreader/MarkdownComponent";

export default function DocView() {
    const markdownContent = '# Titolo del documento\n\nQuesto è un paragrafo di esempio.';

    return (
        <div>
            <h1>Contenuto Markdown</h1>
            <MarkdownComponent markdownContent={markdownContent} />
        </div>
    );
}
