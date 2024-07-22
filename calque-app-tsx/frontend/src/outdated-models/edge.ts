import { Node } from './node.js';
import { Ligne } from './ligne.js';
import { Style, RectangleStyle  } from './style.js';

export class Edge {
    private _name!: string;
    private readonly _node1!: Node;
    private readonly _node2!: Node;
    private readonly _ligne!: Ligne;
    private _duree: Duree | undefined;
    private _style: Style = new RectangleStyle();
    private _isBlocked: boolean = false;
    private readonly _id!: string;

    constructor(_id: string, _name: string, _node1: Node, _node2: Node, _ligne: Ligne, _duree: Duree | undefined = undefined) {}

    // might delete later
    public swapBlockedStatus(): void {
        if (this._isBlocked) {
            this._isBlocked = false
        }
        else {
            this._isBlocked = true
        }
    }
    public get name() : string {
        return this._name;
    }
    public get node1() : Node {
        return this._node1;
    }
    public get node2() : Node {
        return this._node2;
    }
    public get ligne() : Ligne {
        return this._ligne;
    }
    public get duree() : Duree | undefined {
        return this._duree;
    }
    public get style() : Style {
        return this._style;
    }
    public get isBlocked() : boolean {
        return this._isBlocked;
    }
    public get id() : string {
        return this._id;
    }
    
    
    
    public set name(v : string) {
        this._name = v;
    }
    public set duree(v : Duree | undefined) {
        this._duree = v;
    }
    public set style(v : Style) {
        this.style = v;
    }
    public set isBlocked(v : boolean) {
        this._isBlocked = v;
    }
    
}

export type Duree = {heure: string | undefined, minute: string | undefined}; 