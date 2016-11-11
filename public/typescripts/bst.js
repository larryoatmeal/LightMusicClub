define(["require", "exports"], function (require, exports) {
    var BstNode = (function () {
        function BstNode(key, data, parent, isLeft) {
            this.left = null;
            this.right = null;
            this.key = key;
            this.data = data;
            this.parent = parent;
            this.isLeft = isLeft;
        }
        return BstNode;
    })();
    exports.BstNode = BstNode;
    var BstSearchMode;
    (function (BstSearchMode) {
        BstSearchMode[BstSearchMode["Next"] = 0] = "Next";
        BstSearchMode[BstSearchMode["Prev"] = 1] = "Prev";
        BstSearchMode[BstSearchMode["Exact"] = 2] = "Exact";
    })(BstSearchMode || (BstSearchMode = {}));
    var Bst = (function () {
        function Bst(isInterval) {
            this.root = null;
            this.isInterval = false;
            this.nodesSeen = 0;
            this.isInterval = isInterval;
        }
        Bst.prototype.generateFromSortedListRecurse = function (intervals, start, end) {
            if (start > end) {
                return null;
            }
            var mid = Math.floor(start + (end - start) / 2);
            var leftStart = start;
            var leftEnd = mid - 1;
            var rightStart = mid + 1;
            var rightEnd = end;
            var nodeLeft = this.generateFromSortedListRecurse(intervals, leftStart, leftEnd);
            var nodeRight = this.generateFromSortedListRecurse(intervals, rightStart, rightEnd);
            var currentInterval = intervals[mid];
            var maxEnd = Math.max((nodeLeft ? nodeLeft.data.maxEnd : 0), (nodeRight ? nodeRight.data.maxEnd : 0), currentInterval.end);
            var data = {
                "end": currentInterval.end,
                "maxEnd": maxEnd
            };
            var node = new BstNode(currentInterval.start, data, null, false);
            if (nodeLeft) {
                node.left = nodeLeft;
                nodeLeft.isLeft = true;
                nodeLeft.parent = node;
            }
            if (nodeRight) {
                node.right = nodeRight;
                nodeRight.isLeft = false;
                nodeRight.parent = node;
            }
            return node;
        };
        Bst.prototype.generateFromSortedList = function (intervals) {
            this.root = this.generateFromSortedListRecurse(intervals, 0, intervals.length - 1);
        };
        Bst.prototype.search = function (k, d, mode) {
            if (d === void 0) { d = null; }
            if (mode === void 0) { mode = BstSearchMode.Next; }
            return this.searchRecurse(k, d, this.root, mode);
        };
        Bst.prototype.getAdjacent = function (node, mode, k) {
            console.log(node);
            console.log(k);
            switch (mode) {
                case BstSearchMode.Next:
                    if (node.key > k) {
                        return node;
                    }
                    else {
                        return this.next(node);
                    }
                case BstSearchMode.Prev:
                    console.log("Searching for previous");
                    if (node.key < k) {
                        console.log("K is less than node.key");
                        return node;
                    }
                    else {
                        console.log("Returning Previous");
                        return this.prev(node);
                    }
                case BstSearchMode.Exact:
                    if (node.key == k) {
                        return node;
                    }
                    else {
                        return null;
                    }
                default:
                    return this.next(node);
            }
        };
        Bst.prototype.searchRecurse = function (k, d, node, mode) {
            if (mode === void 0) { mode = BstSearchMode.Next; }
            if (k > node.key) {
                if (node.right) {
                    return this.searchRecurse(k, d, node.right, mode);
                }
                else {
                    return this.getAdjacent(node, mode, k);
                }
            }
            else {
                if (node.left) {
                    return this.searchRecurse(k, d, node.left, mode);
                }
                else {
                    return this.getAdjacent(node, mode, k);
                }
            }
        };
        Bst.overlap = function (start1, end1, start2, end2) {
            //Don't overlap if start1 > end2 or start2 > end1
            //DeMOrgan
            return start1 < end2 && start2 < end1;
        };
        Bst.prototype.searchIntervals = function (k, end) {
            this.nodesSeen = 0;
            var nodes = [];
            this.searchRecurseAllIntervals(k, end, this.root, nodes);
            return nodes;
        };
        Bst.prototype.searchRecurseAllIntervals = function (k, end, node, overlappingIntervals) {
            if (node == null) {
                return;
            }
            this.nodesSeen += 1;
            var start = k;
            var nodeStart = node.key;
            var nodeEnd = node.data.end;
            var nodeMaxPossibleEnd = node.data.maxEnd;
            if (start > nodeMaxPossibleEnd) {
                return;
            }
            this.searchRecurseAllIntervals(k, end, node.left, overlappingIntervals);
            if (Bst.overlap(start, end, nodeStart, nodeEnd)) {
                overlappingIntervals.push(node);
            }
            if (end > nodeStart) {
                this.searchRecurseAllIntervals(k, end, node.right, overlappingIntervals);
            }
        };
        Bst.prototype.next = function (n) {
            if (n.right != null) {
                return this.min(n.right);
            }
            else {
                return this.nextRecurse(n);
            }
        };
        Bst.prototype.prev = function (n) {
            if (n.left != null) {
                return this.max(n.left);
            }
            else {
                return this.prevRecurse(n);
            }
        };
        Bst.prototype.nextRecurse = function (n) {
            if (n.parent) {
                if (n.parent.left == n) {
                    return n.parent;
                }
                else {
                    return this.nextRecurse(n.parent);
                }
            }
            else {
                return null;
            }
        };
        Bst.prototype.prevRecurse = function (n) {
            if (n.parent) {
                if (n.parent.right == n) {
                    return n.parent;
                }
                else {
                    return this.prevRecurse(n.parent);
                }
            }
            else {
                return null;
            }
        };
        Bst.prototype.min = function (n) {
            if (n.left == null) {
                return n;
            }
            else {
                return this.min(n.left);
            }
        };
        Bst.prototype.max = function (n) {
            if (n.right == null) {
                return n;
            }
            else {
                return this.max(n.right);
            }
        };
        Bst.prototype.insert = function (k, d) {
            if (this.root == null) {
                this.root = new BstNode(k, d, null, false);
            }
            else {
                this.insertRecurse(k, d, this.root);
            }
        };
        Bst.prototype.insertRecurse = function (k, d, node) {
            this.updateAugmentedInterval(node, d.end);
            if (k > node.key) {
                if (node.right) {
                    this.insertRecurse(k, d, node.right);
                }
                else {
                    var n = new BstNode(k, d, node, false);
                    node.right = n;
                }
            }
            else {
                if (node.left) {
                    this.insertRecurse(k, d, node.left);
                }
                else {
                    var n = new BstNode(k, d, node, true);
                    node.left = n;
                    4;
                }
            }
        };
        Bst.prototype.inorderRecurse = function (node, l) {
            if (node != null) {
                this.inorderRecurse(node.left, l);
                l.push(node);
                this.inorderRecurse(node.right, l);
            }
        };
        Bst.prototype.inorder = function () {
            var l = [];
            this.inorderRecurse(this.root, l);
            return l;
        };
        Bst.prototype.delete = function (n) {
            if (n.left == null && n.right == null) {
                if (n.parent) {
                    if (n.isLeft) {
                        n.parent.left = null;
                    }
                    else {
                        n.parent.right = null;
                    }
                }
            }
            else {
                if (n.right == null) {
                    if (n.isLeft) {
                        n.parent.left = n.left;
                    }
                    else {
                        n.parent.right = n.left;
                    }
                }
                else if (n.left == null) {
                    if (n.isLeft) {
                        n.parent.left = n.right;
                    }
                    else {
                        n.parent.right = n.right;
                    }
                }
                else {
                    var nextNode = this.next(n);
                    if (nextNode.isLeft) {
                        nextNode.parent.left = null;
                    }
                    else {
                        nextNode.parent.right = null;
                    }
                    n.data = nextNode.data;
                    n.key = nextNode.key;
                }
            }
        };
        Bst.prototype.updateAugmentedInterval = function (node, intervalEnd) {
            if (intervalEnd > node.data.maxEnd) {
                node.data.maxEnd = intervalEnd;
            }
        };
        Bst.prototype.bfs = function () {
            var queue = [];
            queue.push(this.root);
            var levels = [[this.root]];
            var levelNum = 1;
            while (levels[levelNum - 1].length > 0) {
                levels.push([]);
                for (var i_1 = 0; i_1 < levels[levelNum - 1].length; i_1++) {
                    var left = levels[levelNum - 1][i_1].left;
                    var right = levels[levelNum - 1][i_1].right;
                    if (left) {
                        levels[levelNum].push(left);
                    }
                    if (right) {
                        levels[levelNum].push(right);
                    }
                }
                levelNum = levelNum + 1;
            }
            for (var i = 0; i < levels.length; i++) {
                var level = levels[i];
                for (var j = 0; j < level.length; j++) {
                    var node = level[j];
                    console.log(node.key + "," + node.data.maxEnd + "," + node.data.end);
                }
                console.log("---------------------");
            }
        };
        return Bst;
    })();
    exports.Bst = Bst;
});
//# sourceMappingURL=bst.js.map