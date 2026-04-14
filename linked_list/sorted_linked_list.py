"""
Sorted Linked List

Implements a sorted singly linked list with support for duplicate removal,
splitting into two equal halves, and computing the intersection of two lists.
All insertions maintain ascending sorted order.
"""

class Node:
    def __init__(self, value):
        self.value = value  
        self.next = None 
    
    def __str__(self):
        return f"Node({self.value})"

    __repr__ = __str__
                        
                          
class SortedLinkedList:
    '''
        >>> x=SortedLinkedList()
        >>> x.add(8.76)
        >>> x.add(1)
        >>> x.add(1)
        >>> x.add(1)
        >>> x.add(5)
        >>> x.add(3)
        >>> x.add(-7.5)
        >>> x.add(4)
        >>> x.add(9.78)
        >>> x.add(4)
        >>> x
        Head:Node(-7.5)
        Tail:Node(9.78)
        List:-7.5 -> 1 -> 1 -> 1 -> 3 -> 4 -> 4 -> 5 -> 8.76 -> 9.78
        >>> x.removeDuplicates()
        >>> x
        Head:Node(-7.5)
        Tail:Node(9.78)
        List:-7.5 -> 1 -> 3 -> 4 -> 5 -> 8.76 -> 9.78
        >>> sub1, sub2 = x.split()
        >>> sub1
        Head:Node(-7.5)
        Tail:Node(4)
        List:-7.5 -> 1 -> 3 -> 4
        >>> sub2
        Head:Node(5)
        Tail:Node(9.78)
        List:5 -> 8.76 -> 9.78
        >>> x
        Head:Node(-7.5)
        Tail:Node(9.78)
        List:-7.5 -> 1 -> 3 -> 4 -> 5 -> 8.76 -> 9.78
        >>> x.add(1)
        >>> x.intersection(sub1)
        Head:Node(-7.5)
        Tail:Node(4)
        List:-7.5 -> 1 -> 3 -> 4
        >>> x=SortedLinkedList() 
        >>> x.add(4.5) 
        >>> x.add(-3) 
        >>> x.add(0)         
        >>> x.add(5) 
        >>> x.add(-9) 
        >>> x.add(12.7) 
        >>> x.add(-3.5) 
        >>> x.add(2) 
        >>> x.add(4) 
        >>> x.add(1) 
        >>> x.add(3) 
        >>> x.add(2) 
        >>> x 
        Head:Node(-9)
        Tail:Node(12.7)
        List:-9 -> -3.5 -> -3 -> 0 -> 1 -> 2 -> 2 -> 3 -> 4 -> 4.5 -> 5 -> 12.7
        >>> sublst1, sublst2 = x.split() 
        >>> sublst1 
        Head:Node(-9)
        Tail:Node(2)
        List:-9 -> -3.5 -> -3 -> 0 -> 1 -> 2
        >>> sublst2 
        Head:Node(2)
        Tail:Node(12.7)
        List:2 -> 3 -> 4 -> 4.5 -> 5 -> 12.7
        >>> x.add(2) 
        >>> x.add(2) 
        >>> x.add(2) 
        >>> x.add(3) 
        >>> x.add(3) 
        >>> x.add(-12) 
        >>> x 
        Head:Node(-12)
        Tail:Node(12.7)
        List:-12 -> -9 -> -3.5 -> -3 -> 0 -> 1 -> 2 -> 2 -> 2 -> 2 -> 2 -> 3 -> 3 -> 3 -> 4 -> 4.5 -> 5 -> 12.7
        >>> x.add(-3) 
        >>> x 
        Head:Node(-12)
        Tail:Node(12.7)
        List:-12 -> -9 -> -3.5 -> -3 -> -3 -> 0 -> 1 -> 2 -> 2 -> 2 -> 2 -> 2 -> 3 -> 3 -> 3 -> 4 -> 4.5 -> 5 -> 12.7
        >>> sublst1, sublst2 = x.split() 
        >>> sublst1                      
        Head:Node(-12)
        Tail:Node(2)
        List:-12 -> -9 -> -3.5 -> -3 -> -3 -> 0 -> 1 -> 2 -> 2 -> 2
        >>> sublst2 
        Head:Node(2)
        Tail:Node(12.7)
        List:2 -> 2 -> 3 -> 3 -> 3 -> 4 -> 4.5 -> 5 -> 12.7
        >>> sublst1.intersection(sublst2) 
        Head:Node(2)
        Tail:Node(2)
        List:2
        >>> sublst1.removeDuplicates() 
        >>> sublst2.removeDuplicates()  
        >>> sublst1   
        Head:Node(-12)
        Tail:Node(2)
        List:-12 -> -9 -> -3.5 -> -3 -> 0 -> 1 -> 2
        >>> sublst2 
        Head:Node(2)
        Tail:Node(12.7)
        List:2 -> 3 -> 4 -> 4.5 -> 5 -> 12.7
        >>> x 
        Head:Node(-12)
        Tail:Node(12.7)
        List:-12 -> -9 -> -3.5 -> -3 -> -3 -> 0 -> 1 -> 2 -> 2 -> 2 -> 2 -> 2 -> 3 -> 3 -> 3 -> 4 -> 4.5 -> 5 -> 12.7
        >>> x.removeDuplicates() 
        >>> x 
        Head:Node(-12)
        Tail:Node(12.7)
        List:-12 -> -9 -> -3.5 -> -3 -> 0 -> 1 -> 2 -> 3 -> 4 -> 4.5 -> 5 -> 12.7
    '''

    def __init__(self):
        self.head=None
        self.tail=None

    def __str__(self):
        temp=self.head
        out=[]
        while temp:
            out.append(str(temp.value))
            temp=temp.next
        out=' -> '.join(out) 
        return f'Head:{self.head}\nTail:{self.tail}\nList:{out}'

    __repr__=__str__


    def isEmpty(self):
        return self.head == None

    def __len__(self):
        if self.head is None:
            return 0
        count=0
        current=self.head
        while current:
            current=current.next
            count+=1
        return count

                
    def add(self, value):
        # --- YOUR CODE STARTS HERE
        newnode=Node(value)
        if self.isEmpty():
            self.head=newnode
            self.tail=newnode
        elif value<=self.head.value:
            newnode.next=self.head
            self.head=newnode
        elif value>self.head.value:
            a=self.head
            while a.next is not None and a.next.value<value:
                a=a.next
            if a.next is None:
                self.tail=newnode
                a.next=newnode
            else:
                newnode.next=a.next
                a.next=newnode

    def split(self):
        # --- YOUR CODE STARTS HERE
        if self.head==None:
            return None
        if self.__len__()==1:
            return None
        size=self.__len__()
        middle_point= self.__len__()//2
        if size%2!=0:
            middle_point+=1
        other_length=size-middle_point
        a=self.head
        count=0
        newsortedlist= SortedLinkedList()
        newsortedlist2= SortedLinkedList()
        for i in range(middle_point):
            newsortedlist.add(a.value)
            a=a.next
            count+=1
        for i in range(other_length):
            newsortedlist2.add(a.value)
            a=a.next
        return newsortedlist,newsortedlist2

    def removeDuplicates(self):
        # --- YOUR CODE STARTS HERE
        a = self.head
        while a.next is not None:  
            if a.value == a.next.value:
                a.next = a.next.next 
                a=a
            else:
                a = a.next 
        self.tail = a
        
    def intersection(self, other):
        # --- YOUR CODE STARTS HERE
        a=self.head
        b=other.head
        newlinkedlist3=SortedLinkedList()
        while a.next is not None and b is not None:
            if a.value==b.value:
                newlinkedlist3.add(a.value)
                a=a.next
                b=b.next
            elif a.value>b.value:
                b=b.next
            elif a.value<b.value:
                a=a.next
        newlinkedlist3.removeDuplicates()
        return newlinkedlist3


if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=True)
