"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { $generateNodesFromDOM } from "@lexical/html";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes, TextNode } from "lexical";
import React from "react";

const editorConfig = {
    // The editor theme

    namespace: "example-editor",
    editable: false,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [
        TextNode,
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
    ],
};

function PrepopulatePlugin({ text }) {
    const [editor] = useLexicalComposerContext();

    const stringifiedEditorState = JSON.stringify(
        editor.getEditorState().toJSON()
    );
    const parsedEditorState = editor.parseEditorState(stringifiedEditorState);

    const editorStateTextString = parsedEditorState.read(() =>
        $getRoot().getAllTextNodes()
    );

    editor.update(() => {
        if (editorStateTextString.length > 0) return;
        // In the browser you can use the native DOMParser API to parse the HTML string.
        const parser = new DOMParser();
        const dom = parser.parseFromString(text, "text/html");

        // Once you have the DOM instance it's easy to generate LexicalNodes.
        const nodes = $generateNodesFromDOM(editor, dom);

        // Select the root
        $getRoot().select();

        nodes.forEach((node) => {
            if (node.style && node.style.color) {
                node.style.color = node.style.color;
            }
        });

        // Insert them at a selection.
        $insertNodes(nodes);
    });

    return null;
}

export default function LexicalTest() {
    return (
        <>
            <LexicalComposer initialConfig={editorConfig}>
                <RichTextPlugin
                    contentEditable={<ContentEditable />}
                    placeholder={null}
                    ErrorBoundary={LexicalErrorBoundary}
                />

                <PrepopulatePlugin
                    text={
                        '<p class="editor-paragraph" dir="ltr"><span style="white-space: pre-wrap;">Next test</span></p>'
                    }
                />
            </LexicalComposer>
        </>
    );
}
