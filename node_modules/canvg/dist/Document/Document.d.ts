/// <reference types="offscreencanvas" />
import { Canvg } from '../Canvg';
import { IScreenViewBoxConfig, Screen } from '../Screen';
import { Property } from '../Property';
import { SVGFontLoader } from '../SVGFontLoader';
import { Element } from './Element';
import { TextNode } from './TextNode';
import { ImageElement } from './ImageElement';
import { SVGElement } from './SVGElement';
import { AnyElement } from './elements';
/**
 * Function to create new canvas.
 */
export declare type CreateCanvas = (width: number, height: number) => HTMLCanvasElement | OffscreenCanvas;
/**
 * Function to create new image.
 */
export declare type CreateImage = (src: string, anonymousCrossOrigin?: boolean) => Promise<CanvasImageSource>;
export interface IDocumentOptions {
    /**
     * Default `rem` size.
     */
    rootEmSize?: number;
    /**
     * Default `em` size.
     */
    emSize?: number;
    /**
     * Function to create new canvas.
     */
    createCanvas?: CreateCanvas;
    /**
     * Function to create new image.
     */
    createImage?: CreateImage;
    /**
     * Load images anonymously.
     */
    anonymousCrossOrigin?: boolean;
}
export declare type IViewBoxConfig = Omit<IScreenViewBoxConfig, 'document'>;
declare type DOMDocument = typeof window.document;
declare function createCanvas(width: number, height: number): HTMLCanvasElement;
declare function createImage(src: string, anonymousCrossOrigin?: boolean): Promise<HTMLImageElement>;
export declare class Document {
    readonly canvg: Canvg;
    static readonly createCanvas: typeof createCanvas;
    static readonly createImage: typeof createImage;
    static readonly elementTypes: Record<string, AnyElement>;
    rootEmSize: number;
    documentElement?: SVGElement;
    readonly screen: Screen;
    readonly createCanvas: CreateCanvas;
    readonly createImage: CreateImage;
    readonly definitions: Record<string, Element>;
    readonly styles: Record<string, Record<string, Property>>;
    readonly stylesSpecificity: Record<string, string>;
    readonly images: ImageElement[];
    readonly fonts: SVGFontLoader[];
    private readonly emSizeStack;
    private uniqueId;
    constructor(canvg: Canvg, { rootEmSize, emSize, createCanvas, createImage, anonymousCrossOrigin }?: IDocumentOptions);
    private bindCreateImage;
    get window(): Window;
    get fetch(): typeof fetch;
    get ctx(): import("..").RenderingContext2D;
    get emSize(): number;
    set emSize(value: number);
    popEmSize(): void;
    getUniqueId(): string;
    isImagesLoaded(): boolean;
    isFontsLoaded(): boolean;
    createDocumentElement(document: DOMDocument): SVGElement;
    createElement<T extends Element>(node: HTMLElement): T;
    createTextNode(node: HTMLElement): TextNode;
    setViewBox(config: IViewBoxConfig): void;
}
export {};
//# sourceMappingURL=Document.d.ts.map