# Python Data Structures & Algorithms

**CS Student @ Penn State University Park**

Implementations of core data structures and algorithms from scratch in Python — no libraries used for the core logic. Each module includes full doctest coverage.

---

## Projects

### Three-Level Cache System (`cache_system/`)
A cache hierarchy (L1, L2, L3) using **doubly linked lists** with MRU and LRU eviction policies. Hash-based routing determines which cache level stores each item. Cache lookups automatically promote nodes to the front of the list.

**Concepts:** Doubly linked lists, hash functions, eviction policies, operator overloading

---

### Infix Calculator (`calculator/`)
A full expression evaluator built on a custom **Stack** implementation. Converts infix expressions to postfix using the **Shunting-yard algorithm**, then evaluates the result. Supports `()`, `[]`, `{}` bracket types, bracket validation, implicit multiplication, and an `AdvancedCalculator` with variable assignment across multi-step expressions.

**Concepts:** Stacks, Shunting-yard algorithm, expression parsing, bracket matching

---

### Graph Algorithms (`graph_algorithms/`)
Implements a **Min Binary Heap** from scratch, builds a **Priority Queue** on top of it, and uses that Priority Queue to run **Dijkstra's shortest path** on a weighted directed graph (adjacency list).

**Concepts:** Binary heaps, priority queues, greedy algorithms, Dijkstra's algorithm

---

### Binary Search Tree (`binary_search_tree/`)
Recursive BST with insert, min/max retrieval, membership testing (`in` operator), height calculation, leaf counting, and balance checking.

**Concepts:** BST, recursion, tree traversal, balance detection

---

### Sorted Linked List (`linked_list/`)
Singly linked list that maintains sorted order on insert. Supports duplicate removal, splitting into equal halves, and intersection of two lists.

**Concepts:** Linked lists, in-place operations, two-pointer technique

---

### University Enrollment System (`oop_university/`)
OOP system modeling Courses, a Catalog (CSV-loaded), Semesters, Students, Staff, and StudentAccounts. Demonstrates class inheritance, properties, operator overloading, and class-level attributes.

> **Note:** `Catalog._loadCatalog()` requires a CSV file in the format `course_id,course_name,credits`

**Concepts:** OOP, inheritance, class vs instance attributes, `__eq__`, `__hash__`, `__contains__`

---

## Running Tests

Each file has a full doctest suite. To run any file:

```bash
python cache_system/cache.py
python calculator/calculator.py
python graph_algorithms/graph.py
python binary_search_tree/bst.py
python linked_list/sorted_linked_list.py
python oop_university/university_system.py
```

---

## Skills Demonstrated

- Python (OOP, functional, generators, iterators)
- Data Structures: linked lists, stacks, heaps, BSTs, hash tables
- Algorithms: Dijkstra's, Shunting-yard, LRU/MRU eviction
- Testing: doctest-driven development
