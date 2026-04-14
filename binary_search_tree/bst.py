"""
Binary Search Tree

Implements a BST with recursive insert, min/max retrieval, membership testing,
height calculation, leaf counting, and balance checking.
"""

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        
    def __str__(self):
        return ("Node({})".format(self.value)) 

    __repr__ = __str__


class BinarySearchTree:
    """
        >>> my_tree = BinarySearchTree()
        >>> my_tree.isEmpty()
        True
        >>> my_tree.isBalanced
        True
        >>> my_tree.insert(9)
        >>> my_tree.insert(5)
        >>> my_tree.get_numLeaves()
        1
        >>> my_tree.insert(14)
        >>> my_tree.insert(4)
        >>> my_tree.insert(6)
        >>> my_tree.get_numLeaves()
        3
        >>> my_tree.insert(5.5)
        >>> my_tree.insert(7)
        >>> my_tree.insert(25)
        >>> my_tree.insert(23)
        >>> my_tree.getMin
        4
        >>> my_tree.getMax
        25
        >>> 67 in my_tree
        False
        >>> 5.5 in my_tree
        True
        >>> my_tree.isEmpty()
        False
        >>> my_tree.getHeight(my_tree.root)   # Height of the tree
        3
        >>> my_tree.getHeight(my_tree.root.left.right)
        1
        >>> my_tree.getHeight(my_tree.root.right)
        2
        >>> my_tree.getHeight(my_tree.root.right.right)
        1
        >>> my_tree.isBalanced
        False
        >>> my_tree.insert(10)
        >>> my_tree.isBalanced
        True
        >>> my_tree.get_numLeaves()
        5
    """
    def __init__(self):
        self.root = None

    def insert(self, value):
        if self.root is None:
            self.root=Node(value)
        else:
            self._insert(self.root, value)

    def _insert(self, node, value):
        if(value<node.value):
            if(node.left==None):
                node.left = Node(value)
            else:
                self._insert(node.left, value)
        else:   
            if(node.right==None):
                node.right = Node(value)
            else:
                self._insert(node.right, value)
    

    def isEmpty(self):
        # YOUR CODE STARTS HERE
        if self.root==None:
            return True
        return False
    


    @property
    def getMin(self): 
        # YOUR CODE STARTS HERE
        if not self.isEmpty():
            current=self.root
            while current.left != None:
                current=current.left
            return current.value
        return None

    @property
    def getMax(self): 
        # YOUR CODE STARTS HERE
        if not self.isEmpty():
            current=self.root
            while current.right != None:
                current=current.right
            return current.value
        return None


    def __contains__(self,value):
        # YOUR CODE STARTS HERE
        return self.__contains__helper__(self.root,value)

    def __contains__helper__(self,node,value):
        if node is None:
            return False
        if node.value==value:
            return True
        elif value<node.value:
            return self.__contains__helper__(node.left,value)
        elif value>node.value:
            return self.__contains__helper__(node.right,value)
        
    def getHeight(self, node):
        # YOUR CODE STARTS HERE
        if node == None:
            return -1
        left_subtree_height = self.getHeight(node.left)
        right_subtree_height = self.getHeight(node.right)
        return max(left_subtree_height, right_subtree_height) +1
       
    def get_numLeaves(self):
        return self._get_numLeaves_helper(self.root)


    def _get_numLeaves_helper(self, node):
        # YOUR CODE STARTS HERE
        if node == None:
            return 0
        if node.left == None and node.right == None:
            return 1
        else:
            left_leaves=self._get_numLeaves_helper(node.left)
            right_leaves=self._get_numLeaves_helper(node.right)
        return left_leaves+right_leaves
        
    @property
    def isBalanced(self):
        return self.isBalanced_helper(self.root)
    
    
    def isBalanced_helper(self, node):
        # YOUR CODE STARTS HERE
        if node is None:
            return True
        if node.left is None and node.right is None:
            return True 
        leftheight=self.getHeight(node.left)
        rightheight=self.getHeight(node.right)
        if abs(leftheight-rightheight)<=1:
            if self.isBalanced_helper(node.left) is True and self.isBalanced_helper(node.right) is True:
                return True 
            return False
        return False


if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=True)
