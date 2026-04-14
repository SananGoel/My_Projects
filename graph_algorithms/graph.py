"""
Graph Algorithms: Min Binary Heap, Priority Queue & Dijkstra's Shortest Path

Implements a MinBinaryHeap from scratch, builds a PriorityQueue on top of it,
and uses that PriorityQueue to run Dijkstra's shortest path algorithm on a
weighted directed graph represented as an adjacency list.
"""

class MinBinaryHeap:
    '''
        >>> h = MinBinaryHeap()
        >>> h.getMin
        >>> h.insert(10)
        >>> h.insert(5)
        >>> h
        [5, 10]
        >>> h.insert(14)
        >>> h._heap
        [5, 10, 14]
        >>> h.insert(9)
        >>> h
        [5, 9, 14, 10]
        >>> h.insert(2)
        >>> h
        [2, 5, 14, 10, 9]
        >>> h.insert(11)
        >>> h
        [2, 5, 11, 10, 9, 14]
        >>> h.insert(14)
        >>> h
        [2, 5, 11, 10, 9, 14, 14]
        >>> h.insert(20)
        >>> h
        [2, 5, 11, 10, 9, 14, 14, 20]
        >>> h.insert(20)
        >>> h
        [2, 5, 11, 10, 9, 14, 14, 20, 20]
        >>> h.getMin
        2
        >>> h._leftChild(1)
        5
        >>> h._rightChild(1)
        11
        >>> h._parent(1)
        >>> h._parent(6)
        11
        >>> h._leftChild(6)
        >>> h._rightChild(9)
        >>> h.deleteMin()
        2
        >>> h._heap
        [5, 9, 11, 10, 20, 14, 14, 20]
        >>> h.deleteMin()
        5
        >>> h
        [9, 10, 11, 20, 20, 14, 14]
        >>> len(h)
        7
        >>> h.getMin
        9
    '''

    def __init__(self):
        self._heap=[]
        
    def __str__(self):
        return f'{self._heap}'

    __repr__=__str__

    def __len__(self):
        return len(self._heap)

    @property
    def getMin(self):
        # - YOUR CODE STARTS HERE -
        if len(self)==0:
            return None 
        return self._heap[0]
        
    
    def _parent(self,index):
        # - YOUR CODE STARTS HERE -
        if index <= 1:
            return None
        parentindx=index//2
        return self._heap[parentindx-1]
        
    def _leftChild(self,index):
        # - YOUR CODE STARTS HERE -
        child_index = 2 * index 
        if child_index  <= len(self._heap):
            return self._heap[child_index-1]
        return None


    def _rightChild(self,index):
        # - YOUR CODE STARTS HERE -
        child_index = 2 * index+1
        if child_index <= len(self._heap):
            return self._heap[child_index-1]
        return None

 
    
    def insert(self,item):
        # - YOUR CODE STARTS HERE -
        self._heap.append(item)
        curr = len(self._heap)  
        while curr > 1:
            parent_idx = curr // 2  
            parent_value = self._parent(curr)  

            if parent_value is not None and self._heap[curr - 1] < parent_value:
              
                temp = self._heap[curr - 1]
                self._heap[curr - 1] = self._heap[parent_idx - 1]
                self._heap[parent_idx - 1] = temp
                curr = parent_idx 
            else:
                curr = 0
            
        
                

    def deleteMin(self):
        if len(self)==0:
            return None        
        elif len(self)==1:
            value=self._heap[0]
            self._heap=[]
            return value 

        # - YOUR CODE STARTS HERE -
        return_value = self._heap[0]
        self._heap[0] = self._heap.pop()  
        root = 1
        max_index = len(self._heap)
        while not 2 * root > max_index:
            smallest = root
            left_value = self._leftChild(root)
            right_value = self._rightChild(root)
            smallest_value=self._heap[smallest-1]
            if left_value is not None and left_value < smallest_value:
                left_index = 2 * root - 1  
                if self._heap[left_index] < smallest_value:
                    smallest = 2 * root
            smallest_value=self._heap[smallest-1]

            if right_value is not None and right_value < smallest_value:
                right_index = 2 * root  
                if self._heap[right_index] < smallest_value:
                    smallest = 2 * root +1
            if smallest != root:
                temp=self._heap[root-1]
                self._heap[root-1]=self._heap[smallest-1]
                self._heap[smallest-1]=temp
                root = smallest
            else:
                max_index = 0 

        return return_value
    



class PriorityQueue:
    '''
        >>> priority_q = PriorityQueue()
        >>> priority_q.isEmpty()
        True
        >>> priority_q.peek()
        >>> priority_q.enqueue('sara',0)
        >>> priority_q
        [(0, 'sara')]
        >>> priority_q.enqueue('kyle',3)
        >>> priority_q
        [(0, 'sara'), (3, 'kyle')]
        >>> priority_q.enqueue('harsh',1)
        >>> priority_q
        [(0, 'sara'), (3, 'kyle'), (1, 'harsh')]
        >>> priority_q.enqueue('ajay',5)
        >>> priority_q
        [(0, 'sara'), (3, 'kyle'), (1, 'harsh'), (5, 'ajay')]
        >>> priority_q.enqueue('daniel',4)
        >>> priority_q.isEmpty()
        False
        >>> priority_q
        [(0, 'sara'), (3, 'kyle'), (1, 'harsh'), (5, 'ajay'), (4, 'daniel')]
        >>> priority_q.enqueue('ryan',7)
        >>> priority_q
        [(0, 'sara'), (3, 'kyle'), (1, 'harsh'), (5, 'ajay'), (4, 'daniel'), (7, 'ryan')]
        >>> priority_q.dequeue()
        (0, 'sara')
        >>> priority_q.peek()
        'harsh'
        >>> priority_q
        [(1, 'harsh'), (3, 'kyle'), (7, 'ryan'), (5, 'ajay'), (4, 'daniel')]
        >>> priority_q.dequeue()
        (1, 'harsh')
        >>> len(priority_q)
        4
        >>> priority_q.dequeue()
        (3, 'kyle')
        >>> priority_q.dequeue()
        (4, 'daniel')
        >>> priority_q.dequeue()
        (5, 'ajay')
        >>> priority_q.dequeue()
        (7, 'ryan')
        >>> priority_q.dequeue()
        >>> priority_q.isEmpty()
        True
    '''

    def __init__(self):
        self._items = MinBinaryHeap()
    
    def enqueue(self, value, priority):
        # - YOUR CODE STARTS HERE -
        self._items.insert((priority, value))
        
    
    def dequeue(self):
        # - YOUR CODE STARTS HERE -
        if len(self._items) == 0:
            return None
        min_item = self._items.deleteMin()
        return min_item
    
    def peek(self):
        # - YOUR CODE STARTS HERE -
        if len(self._items) == 0:
            return None
        priority, value = self._items.getMin
        return value

    def isEmpty(self):
        # - YOUR CODE STARTS HERE -
        if len(self._items)==0:
            return True
        return False


    def __len__(self):
        return len(self._items)

    def __str__(self):
        return str(self._items)

    __repr__ = __str__


class Graph:
    """
        >>> d_g1={
        ... 'A':[('B',2),('C',6),('D',7)],
        ... 'B':[('C',3),('G',12)],
        ... 'C':[('D',2),('E',3)],
        ... 'D':[('C',1),('E',2)],
        ... 'E':[('G',5)],
        ... 'F':[('D',2),('E',4)]}
        >>> my_graph = Graph(d_g1)
        >>> my_graph.addEdge('G', 'C', 4)
        >>> my_graph
        {'A': [('B', 2), ('C', 6), ('D', 7)], 'B': [('C', 3), ('G', 12)], 'C': [('D', 2), ('E', 3)], 'D': [('C', 1), ('E', 2)], 'E': [('G', 5)], 'F': [('D', 2), ('E', 4)], 'G': [('C', 4)]}
        >>> my_graph.dijkstra_table('A')   # ---> order of key,value pairs does not matter 
        {'A': 0, 'B': 2, 'C': 5, 'D': 7, 'E': 8, 'F': inf, 'G': 13}
    """
    def __init__(self, graph_repr=None):
        if graph_repr is None:
            self.vertList = {}
        else:
            self.vertList = graph_repr

    def __str__(self):
        return str(self.vertList)

    __repr__ = __str__

    def addVertex(self, key):
        if key not in self.vertList:
            self.vertList[key] = []
            return self.vertList

    def addEdge(self, frm, to, cost=1):
        if frm not in self.vertList:
            self.addVertex(frm)
        if to not in self.vertList:
            self.addVertex(to)
        self.vertList[frm].append((to, cost))


    def dijkstra_table(self,start):
        # - YOUR CODE STARTS HERE -
        pq = PriorityQueue()
        mydict = {}  
        for vertex in self.vertList:
            mydict[vertex] = float("Infinity")
        mydict[start] = 0
        pq.enqueue(start, 0)
        while not pq.isEmpty():
            current_node = pq.dequeue()
            if isinstance(current_node, tuple):
                current_node = current_node[1]
            if current_node in self.vertList:  
                for adjacent_node, cost in self.vertList[current_node]:
                    if adjacent_node in mydict:  
                        new_distance = mydict[current_node] + cost
                        if new_distance < mydict[adjacent_node]:
                            mydict[adjacent_node] = new_distance
                            pq.enqueue(adjacent_node, new_distance)

        return mydict


if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=True)
