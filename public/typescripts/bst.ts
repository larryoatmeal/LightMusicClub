
import NumberFormat = Intl.NumberFormat;
export interface Node{
    left: Node,
    right: Node,
    key : number,
    data: NodeAuxData,
    parent: Node,
    isLeft: boolean
}


export interface Interval{
    start: number,
    end: number
}

export interface NodeAuxData{
    end: number,
    maxEnd: number
}


export class BstNode implements Node{
    left:Node;
    right:Node;
    key:number;
    data:NodeAuxData;
    parent: Node;
    isLeft: boolean;

    constructor(key: number, data: NodeAuxData, parent: Node, isLeft: boolean) {
        this.left = null;
        this.right = null;
        this.key = key;
        this.data = data;
        this.parent = parent;
        this.isLeft = isLeft;
    }
}

enum BstSearchMode{
    Next = 0,
    Prev = 1,
    Exact = 2
}


export class Bst{
    root: Node= null;
    isInterval: boolean = false;

    nodesSeen: number = 0;


    constructor(isInterval: boolean) {
        this.isInterval = isInterval;
    }

    generateFromSortedListRecurse(intervals: Interval[], start: number, end: number): BstNode{
        if(start > end){
            return null;
        }
        const mid = Math.floor(start + (end - start)/2);
        const leftStart = start;
        const leftEnd = mid - 1;
        const rightStart = mid + 1;
        const rightEnd = end;


        var nodeLeft = this.generateFromSortedListRecurse(intervals, leftStart, leftEnd);
        var nodeRight = this.generateFromSortedListRecurse(intervals, rightStart, rightEnd);

        var currentInterval = intervals[mid];
        var maxEnd = Math.max(
            (nodeLeft ? nodeLeft.data.maxEnd : 0),
            (nodeRight ? nodeRight.data.maxEnd : 0),
            currentInterval.end
        );

        //console.log(maxEnd);

        var data = {
            "end": currentInterval.end,
            "maxEnd": maxEnd
        };

        const node = new BstNode(currentInterval.start, data, null, false);

        if(nodeLeft){
            node.left = nodeLeft;
            nodeLeft.isLeft = true;
            nodeLeft.parent = node;
        }
        if(nodeRight){
            node.right = nodeRight;
            nodeRight.isLeft = false;
            nodeRight.parent = node;
        }

        return node;
    }

    generateFromSortedList(intervals: Interval[]){

        this.root = this.generateFromSortedListRecurse(intervals, 0, intervals.length-1);
    }

    search(k: number, d: any = null, mode: BstSearchMode = BstSearchMode.Next): Node{
        return this.searchRecurse(k, d, this.root, mode);
    }

    getAdjacent(node: Node, mode: BstSearchMode, k: number){
        console.log(node);
        console.log(k);
        switch (mode){
            case BstSearchMode.Next:
                if(node.key > k){
                    return node;
                }else{
                    return this.next(node);
                }
            case BstSearchMode.Prev:
                console.log("Searching for previous");
                if(node.key < k){
                    console.log("K is less than node.key");
                    return node;
                }else{
                    console.log("Returning Previous");

                    return this.prev(node);
                }
            case BstSearchMode.Exact:
                if(node.key == k){
                    return node;
                }else{
                    return null;
                }
            default:
                return this.next(node);
        }
    }

    searchRecurse(k: number, d: any, node: Node, mode: BstSearchMode = BstSearchMode.Next): Node{
        if(k > node.key){
            if(node.right){
                return this.searchRecurse(k, d, node.right, mode);
            }else{
                return this.getAdjacent(node, mode, k);
            }
        }else{
            if(node.left){
                return this.searchRecurse(k, d, node.left, mode);
            }else{
                return this.getAdjacent(node, mode, k);
            }
        }
    }

    static overlap(start1: number, end1: number, start2: number, end2: number): boolean{
        //Don't overlap if start1 > end2 or start2 > end1
        //DeMOrgan

        return start1 < end2 && start2 < end1;

    }

    searchIntervals(k: number, end: number): Node[]{
        this.nodesSeen = 0;
        var nodes: Node[] = [];
        this.searchRecurseAllIntervals(k, end, this.root, nodes);
/*
        console.log("NODES SEEN");
*/
/*
        console.log(this.nodesSeen);
*/
        return nodes;
    }

    searchRecurseAllIntervals(k: number, end: number, node: Node, overlappingIntervals: Node[]){
        if(node == null){
            return;
        }
        this.nodesSeen += 1;

        var start = k;

        var nodeStart = node.key;
        var nodeEnd = node.data.end;
        var nodeMaxPossibleEnd = node.data.maxEnd;

        if(start > nodeMaxPossibleEnd){//for every interval in both subtrees, the queried interval will come after
            return;
        }

        //assuming queried interval does not start after all intervals, could be in left subtree
        this.searchRecurseAllIntervals(k, end, node.left, overlappingIntervals);


        if(Bst.overlap(start, end, nodeStart, nodeEnd)){
            overlappingIntervals.push(node);
        }

        //entirety of right subtree will not overlap if start points greater than the queried end point
        //only check right subtree if okay
        if(end > nodeStart){
            this.searchRecurseAllIntervals(k, end, node.right, overlappingIntervals);
        }
    }

    next(n: Node): Node{
        if(n.right != null){
            return this.min(n.right);
        }else{
            return this.nextRecurse(n);
        }
    }
    prev(n: Node): Node{
        if(n.left != null){
            return this.max(n.left);
        }else{
            return this.prevRecurse(n);
        }
    }

    nextRecurse(n: Node): Node{
        //keep going up until we are a left subchild
        if(n.parent){
            if(n.parent.left == n){
                return n.parent;
            }
            else{
                return this.nextRecurse(n.parent);
            }
        }else{
            return null;
        }
    }
    prevRecurse(n: Node): Node{
        //keep going up until we are a left subchild
        if(n.parent){
            if(n.parent.right == n){
                return n.parent;
            }
            else{
                return this.prevRecurse(n.parent);
            }
        }else{
            return null;
        }
    }

    min(n: Node): Node{
        if(n.left == null){
            return n;
        }else{
            return this.min(n.left);
        }
    }
    max(n: Node): Node{
        if(n.right == null){
            return n;
        }else{
            return this.max(n.right);
        }
    }

    insert(k: number, d: any){
        if(this.root == null){
            this.root = new BstNode(k, d, null, false);
        }
        else{
            this.insertRecurse(k, d, this.root);
        }
    }

    insertRecurse(k: number, d: any, node: Node){
        //node cannot be null
        this.updateAugmentedInterval(node, d.end);

        if(k > node.key){
            if(node.right){
                this.insertRecurse(k, d, node.right);
            }else{
                var n: Node = new BstNode(k, d, node, false);
                node.right = n;
            }
        }else{
            if(node.left){
                this.insertRecurse(k, d, node.left);
            }else{
                var n: Node = new BstNode(k, d, node, true);
                node.left = n;  4
            }
        }
    }

    inorderRecurse(node: Node, l: Node[]){

        if(node != null){
            this.inorderRecurse(node.left, l);
            l.push(node);
            this.inorderRecurse(node.right, l);
        }
    }

    inorder(): Node[]{
        var l: Node[] = [];
        this.inorderRecurse(this.root, l);
        return l;
    }

    delete(n: Node){
        if(n.left == null && n.right == null){//leaf
            if(n.parent){
                if(n.isLeft){
                    n.parent.left = null;
                }
                else{
                    n.parent.right = null;
                }
            }
        }else{
            //one leaf
            if(n.right == null){//only left tree
                if(n.isLeft){
                    n.parent.left = n.left;
                }else{
                    n.parent.right = n.left;
                }
            }
            else if(n.left == null){//only right tree
                if(n.isLeft){
                    n.parent.left = n.right;
                }else{
                    n.parent.right = n.right;
                }
            }
            else{//both tress
                var nextNode: Node = this.next(n);
                if(nextNode.isLeft){
                    nextNode.parent.left = null;
                }else{
                    nextNode.parent.right = null;
                }

                n.data =  nextNode.data;
                n.key = nextNode.key;

            }

        }

    }

    //updateAugmentedInterval(node: Node, intervalEnd: number){
    //    if(node != null && intervalEnd > node.data.end){
    //        node.data.end = intervalEnd;
    //        this.updateAugmentedInterval(node.parent, intervalEnd);
    //    }
    //}

    updateAugmentedInterval(node: Node, intervalEnd: number){
        if(intervalEnd > node.data.maxEnd){
            node.data.maxEnd = intervalEnd;
        }
    }

    bfs(){
        var queue: Node[] = [];

        queue.push(this.root);

        var levels = [[this.root]];

        var levelNum = 1;

        while(levels[levelNum-1].length > 0 ){
            //var top: Node = queue[0];
            //string += top.key;

            levels.push([]);
            for(let i = 0; i < levels[levelNum-1].length; i++){
                var left = levels[levelNum-1][i].left;
                var right = levels[levelNum-1][i].right;

                if(left){
                    levels[levelNum].push(left);
                }
                if(right){
                    levels[levelNum].push(right);
                }
            }
            levelNum = levelNum + 1;
        }

        for(var i = 0; i < levels.length; i++){
            var level = levels[i];
            for(var j = 0; j < level.length; j++){
                var node = level[j];
                console.log(node.key + "," + node.data.maxEnd + "," + node.data.end);
            }
            console.log("---------------------");
        }

    }


}

