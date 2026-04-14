"""
University Enrollment System (OOP)

Models a university system with Courses, a Catalog (loaded from CSV), Semesters,
Students, Staff, and StudentAccounts. Demonstrates OOP design with inheritance,
properties, operator overloading, and class-level attributes.

Note: Catalog._loadCatalog() requires a CSV file in the format: course_id,course_name,credits
"""

import random

class Course:
    '''
        >>> c1 = Course('CMPSC132', 'Programming in Python II', 3)
        >>> c2 = Course('CMPSC360', 'Discrete Mathematics', 3)
        >>> c1 == c2
        False
        >>> c3 = Course('CMPSC132', 'Programming in Python II', 3)
        >>> c1 == c3
        True
        >>> c1
        CMPSC132(3): Programming in Python II
        >>> c2
        CMPSC360(3): Discrete Mathematics
        >>> c3
        CMPSC132(3): Programming in Python II
        >>> c1 == None
        False
        >>> print(c1)
        CMPSC132(3): Programming in Python II
    '''
    def __init__(self, cid, cname, credits):
        # YOUR CODE STARTS HERE
        self.cid=cid
        self.cname=cname
        self.credits=credits



    def __str__(self):
        # YOUR CODE STARTS HERE
        return f"{self.cid}({self.credits}): {self.cname}"
        

    __repr__ = __str__

    def __eq__(self, other):
        # YOUR CODE STARTS HERE
        if isinstance(other,Course):
            return self.cid==other.cid
        return False


class Catalog:
    ''' 
        >>> C = Catalog()
        >>> C.courseOfferings
        {}
        >>> C._loadCatalog("cmpsc_catalog_small.csv")
        >>> C.courseOfferings
        {'CMPSC 132': CMPSC 132(3): Programming and Computation II, 'MATH 230': MATH 230(4): Calculus and Vector Analysis, 'PHYS 213': PHYS 213(2): General Physics, 'CMPEN 270': CMPEN 270(4): Digital Design, 'CMPSC 311': CMPSC 311(3): Introduction to Systems Programming, 'CMPSC 360': CMPSC 360(3): Discrete Mathematics for Computer Science}
        >>> C.removeCourse('CMPSC 360')
        'Course removed successfully'
        >>> C.courseOfferings
        {'CMPSC 132': CMPSC 132(3): Programming and Computation II, 'MATH 230': MATH 230(4): Calculus and Vector Analysis, 'PHYS 213': PHYS 213(2): General Physics, 'CMPEN 270': CMPEN 270(4): Digital Design, 'CMPSC 311': CMPSC 311(3): Introduction to Systems Programming}
        >>> isinstance(C.courseOfferings['CMPSC 132'], Course)
        True
    '''

    def __init__(self):
        # YOUR CODE STARTS HERE
        self.courseOfferings={}
        


    def addCourse(self, cid, cname, credits):
        # YOUR CODE STARTS HERE
        if self.cid not in self.courseOfferings:
            self.cid=cid
            self.cname=cname
            self.credits=credits
            parameter=Course(cid,cname,credits)
            self.courseOfferings[self.cid]=parameter
            return f"Course added successfully"
        return f"Course already added"
        
    def removeCourse(self, cid):
        # YOUR CODE STARTS HERE
        self.cid=cid
        if self.cid in self.courseOfferings:
            self.cid=cid
            del self.courseOfferings[self.cid]
            return f"Course removed successfully"
        return f"Course not found"
        

    def _loadCatalog(self, file):
        with open(file, 'r') as f: 
            course_info = f.read()
        # YOUR CODE STARTS HERE
        lst=[]
        lst2=[]
        lst= course_info.split("\n")
        for i in lst:
            lst2.append(i.split(","))
        length= len(lst2)
        for y in range(length):
            id=lst2[0][0]
            name=lst2[0][1]
            credits=lst2[0][2]
            lst2.pop(0)
            parameter=Course(id,name,credits)
            self.courseOfferings[id]=parameter


class Semester:
    '''
        >>> cmpsc131 = Course('CMPSC 131', 'Programming in Python I', 3)
        >>> cmpsc132 = Course('CMPSC 132', 'Programming in Python II', 3)
        >>> math230 = Course("MATH 230", 'Calculus', 4)
        >>> phys213 = Course("PHYS 213", 'General Physics', 2)
        >>> econ102 = Course("ECON 102", 'Intro to Economics', 3)
        >>> phil119 = Course("PHIL 119", 'Ethical Leadership', 3)
        >>> spr22 = Semester()
        >>> spr22
        No courses
        >>> spr22.addCourse(cmpsc132)
        >>> isinstance(spr22.courses['CMPSC 132'], Course)
        True
        >>> spr22.addCourse(math230)
        >>> spr22
        CMPSC 132; MATH 230
        >>> spr22.isFullTime
        False
        >>> spr22.totalCredits
        7
        >>> spr22.addCourse(phys213)
        >>> spr22.addCourse(econ102)
        >>> spr22.addCourse(econ102)
        'Course already added'
        >>> spr22.addCourse(phil119)
        >>> spr22.isFullTime
        True
        >>> spr22.dropCourse(phil119)
        >>> spr22.addCourse(Course("JAPNS 001", 'Japanese I', 4))
        >>> spr22.totalCredits
        16
        >>> spr22.dropCourse(cmpsc131)
        'No such course'
        >>> spr22.courses
        {'CMPSC 132': CMPSC 132(3): Programming in Python II, 'MATH 230': MATH 230(4): Calculus, 'PHYS 213': PHYS 213(2): General Physics, 'ECON 102': ECON 102(3): Intro to Economics, 'JAPNS 001': JAPNS 001(4): Japanese I}
    '''


    def __init__(self):
        # --- YOUR CODE STARTS HERE
        self.courses={}


    def __str__(self):
        # YOUR CODE STARTS HERE
        if len(self.courses)==0:
            return f"No courses"
        my_str=""
        for key,value in self.courses.items():
            my_str+=f"{key}; "
        my_str=my_str[:-2]
        return my_str
        

    __repr__ = __str__

    def addCourse(self, course):
        # YOUR CODE STARTS HERE
        self.course=course
        if course.cid in self.courses:
            return f"Course already added"
        else:
            self.courses[course.cid]=course

    def dropCourse(self, course):
        # YOUR CODE STARTS HERE
        self.course=course
        if course.cid in self.courses:
            del self.courses[course.cid]
        else:
            return f"No such course"

    @property
    def totalCredits(self):
        # YOUR CODE STARTS HERE
        a=0
        for key,values in self.courses.items():
           a+=int(values.credits)
        return a


    @property
    def isFullTime(self):
        # YOUR CODE STARTS HERE
        if self.totalCredits>=12:
            return True
        return False


    
class Loan:
    '''
        >>> import random
        >>> random.seed(2)  # Setting seed to a fixed value, so you can predict what numbers the random module will generate
        >>> first_loan = Loan(4000)
        >>> first_loan
        Balance: $4000
        >>> first_loan.loan_id
        17412
        >>> second_loan = Loan(6000)
        >>> second_loan.amount
        6000
        >>> second_loan.loan_id
        22004
        >>> third_loan = Loan(1000)
        >>> third_loan.loan_id
        21124
    '''
    

    def __init__(self, amount):
        # YOUR CODE STARTS HERE
        self.amount=amount
        self.loan_id=self.__getloanID



    def __str__(self):
        # YOUR CODE STARTS HERE
        return f"Balance: ${self.amount}"


    __repr__ = __str__


    @property
    def __getloanID(self):
        # YOUR CODE STARTS HERE
        random_int=random.randint(10000, 99999)
        return random_int



class Person:
    '''
        >>> p1 = Person('Jason Lee', '204-99-2890')
        >>> p2 = Person('Karen Lee', '247-01-2670')
        >>> p1
        Person(Jason Lee, ***-**-2890)
        >>> p2
        Person(Karen Lee, ***-**-2670)
        >>> p3 = Person('Karen Smith', '247-01-2670')
        >>> p3
        Person(Karen Smith, ***-**-2670)
        >>> p2 == p3
        True
        >>> p1 == p2
        False
    '''

    def __init__(self, name, ssn):
        # YOUR CODE STARTS HERE
        self.name=name
        self.ssn=ssn
        

    def __str__(self):
        # YOUR CODE STARTS HERE
        a=self.ssn.split("-")
        a[0]="***"
        a[1]="**"
        my_str=""
        my_str="Person("+self.name+", "+a[0]+"-"+a[1]+"-"+a[2]+")"
        return my_str
        

    __repr__ = __str__

    def get_ssn(self):
        # YOUR CODE STARTS HERE
        return self.ssn
        

    def __eq__(self, other):
        # YOUR CODE STARTS HERE
        if self.ssn==other.ssn:
            return True
        return False
        

class Staff(Person):
    '''
        >>> C = Catalog()
        >>> C._loadCatalog("cmpsc_catalog_small.csv")
        >>> s1 = Staff('Jane Doe', '214-49-2890')
        >>> s1.getSupervisor
        >>> s2 = Staff('John Doe', '614-49-6590', s1)
        >>> s2.getSupervisor
        Staff(Jane Doe, 905jd2890)
        >>> s1 == s2
        False
        >>> s2.id
        '905jd6590'
        >>> p = Person('Jason Smith', '221-11-2629')
        >>> st1 = s1.createStudent(p)
        >>> isinstance(st1, Student)
        True
        >>> s2.applyHold(st1)
        'Completed!'
        >>> st1.registerSemester()
        'Unsuccessful operation'
        >>> s2.removeHold(st1)
        'Completed!'
        >>> st1.registerSemester()
        >>> st1.enrollCourse('CMPSC 132', C)
        'Course added successfully'
        >>> st1.semesters
        {1: CMPSC 132}
        >>> s1.applyHold(st1)
        'Completed!'
        >>> st1.enrollCourse('CMPSC 360', C)
        'Unsuccessful operation'
        >>> st1.semesters
        {1: CMPSC 132}
    '''
    def __init__(self, name, ssn, supervisor=None):
        # YOUR CODE STARTS HERE
        self.name=name
        self.ssn=ssn
        self.supervisor=supervisor
        


    def __str__(self):
        # YOUR CODE STARTS HERE
        id=self.id
        return f"Staff({self.name}, {id})"

    __repr__ = __str__


    @property
    def id(self):
        # YOUR CODE STARTS HERE
        a=self.name.split(" ")
        initial1= a[0]
        initial2=a[1]
        initial1=initial1[0].lower()
        initial2=initial2[0].lower()
        ssn_last_four_digits=self.ssn[-4:]
        return "905"+initial1+initial2+ssn_last_four_digits
        

    @property   
    def getSupervisor(self):
        # YOUR CODE STARTS HERE
        return self.supervisor
        

    def setSupervisor(self, new_supervisor):
        # YOUR CODE STARTS HERE
        if isinstance(new_supervisor,Staff):
            self.supervisor=new_supervisor.supervisor
            return f"Completed"
        return None
        


    def applyHold(self, student):
        # YOUR CODE STARTS HERE
        if isinstance(student,Student):
            student.hold =True
            return "Completed!"
        return None
        

    def removeHold(self, student):
        # YOUR CODE STARTS HERE
        if isinstance(student, Student):
            student.hold=False
            return "Completed!"
        return None

    def unenrollStudent(self, student):
        # YOUR CODE STARTS HERE
        if isinstance(student, Student):
            student.active=False
            return "Completed!"
        return None

    def createStudent(self, person):
        # YOUR CODE STARTS HERE
        if isinstance(person, Person):
            student = Student(person.name, person.ssn, "Freshman")
            return student
        


class Student(Person):
    '''
        >>> C = Catalog()
        >>> C._loadCatalog("cmpsc_catalog_small.csv")
        >>> s1 = Student('Jason Lee', '204-99-2890', 'Freshman')
        >>> s1
        Student(Jason Lee, jl2890, Freshman)
        >>> s2 = Student('Karen Lee', '247-01-2670', 'Freshman')
        >>> s2
        Student(Karen Lee, kl2670, Freshman)
        >>> s1 == s2
        False
        >>> s1.id
        'jl2890'
        >>> s2.id
        'kl2670'
        >>> s1.registerSemester()
        >>> s1.enrollCourse('CMPSC 132', C)
        'Course added successfully'
        >>> s1.semesters
        {1: CMPSC 132}
        >>> s1.enrollCourse('CMPSC 360', C)
        'Course added successfully'
        >>> s1.enrollCourse('CMPSC 465', C)
        'Course not found'
        >>> s1.semesters
        {1: CMPSC 132; CMPSC 360}
        >>> s2.semesters
        {}
        >>> s1.enrollCourse('CMPSC 132', C)
        'Course already enrolled'
        >>> s1.dropCourse('CMPSC 360')
        'Course dropped successfully'
        >>> s1.dropCourse('CMPSC 360')
        'Course not found'
        >>> s1.semesters
        {1: CMPSC 132}
        >>> s1.registerSemester()
        >>> s1.semesters
        {1: CMPSC 132, 2: No courses}
        >>> s1.enrollCourse('CMPSC 360', C)
        'Course added successfully'
        >>> s1.semesters
        {1: CMPSC 132, 2: CMPSC 360}
        >>> s1.registerSemester()
        >>> s1.semesters
        {1: CMPSC 132, 2: CMPSC 360, 3: No courses}
        >>> s1
        Student(Jason Lee, jl2890, Sophomore)
        >>> s1.classCode
        'Sophomore'
    '''
    def __init__(self, name, ssn, year):
        random.seed(1)
        # YOUR CODE STARTS HERE
        self.name=name
        self.ssn=ssn
        self.classCode=year
        self.account=self.__createStudentAccount()
        self.hold = False
        self.active = True
        self.semesters={}
       
        

    def __str__(self):
        # YOUR CODE STARTS HERE
        return f"Student({self.name}, {self.id}, {self.classCode})"

    __repr__ = __str__

    def __createStudentAccount(self):
        # YOUR CODE STARTS HERE
        studentaccount= StudentAccount(self)
        return studentaccount 
        


    @property
    def id(self):
        # YOUR CODE STARTS HERE
        a=self.name.split(" ")
        initial1= a[0]
        initial2=a[1]
        initial1=initial1[0].lower()
        initial2=initial2[0].lower()
        ssn_last_four_digits=self.ssn[-4:]
        return initial1+initial2+ssn_last_four_digits

        

    def registerSemester(self):
        # YOUR CODE STARTS HERE
        if self.hold == True or  self.active==False:
            return "Unsuccessful operation"
        if not self.semesters:
            a=1
        else:
            a=max(self.semesters.keys())+1
        self.semesters[a]=Semester()
        b=max(self.semesters.keys())
        if b==1 or b==2:
            self.classCode="Freshman"
        if b==3 or b==4:
            self.classCode="Sophomore"
        if b==5 or b==6:
            self.classCode="Junior"
        if b==7 or b==8:
            self.classCode="Senior"
        
    
    def enrollCourse(self, cid, catalog):
        # YOUR CODE STARTS HERE
        b=max(self.semesters.keys())
        if self.active==False or self.hold==True:
            return "Unsuccessful operation"
        if cid in self.semesters[b].courses:
            return "Course already enrolled"
        if cid in catalog.courseOfferings.keys():
            course_object=catalog.courseOfferings[cid]
            self.semesters[b].addCourse(course_object)
            credits = int(course_object.credits)
            self.account.balance+=credits*int(self.account.CREDIT_PRICE)
            return "Course added successfully"
        if cid not in catalog.courseOfferings.keys():
            return "Course not found"
        
        

    def dropCourse(self, cid):
        # YOUR CODE STARTS HERE
        b=max(self.semesters.keys())

        if self.active==False or self.hold==True:
            return "Unsuccessful operation"
        if cid in self.semesters[b].courses:
            course_object = self.semesters[b].courses[cid]
            credits = int(course_object.credits)

            del self.semesters[b].courses[cid]
            self.account.balance -= credits * 1/2 * int(self.account.CREDIT_PRICE)
            return "Course dropped successfully"
        else:
            return "Course not found"
      
        

    def getLoan(self, amount):
        # YOUR CODE STARTS HERE
        b=max(self.semesters.keys())
        if not self.semesters[b].isFullTime:
            return "Not full-time"
        if self.active==False:
            return "Unsuccessful operation"
        else:
            Loan_class=Loan(amount)
            loan_id=Loan_class.loan_id
            self.account.loans[loan_id]= Loan_class
            self.account.makePayment(amount)
        


class StudentAccount:
    '''
        >>> C = Catalog()
        >>> C._loadCatalog("cmpsc_catalog_small.csv")
        >>> s1 = Student('Jason Lee', '204-99-2890', 'Freshman')
        >>> s1.registerSemester()
        >>> s1.enrollCourse('CMPSC 132', C)
        'Course added successfully'
        >>> s1.account.balance
        3000
        >>> s1.enrollCourse('CMPSC 360', C)
        'Course added successfully'
        >>> s1.account.balance
        6000
        >>> s1.enrollCourse('MATH 230', C)
        'Course added successfully'
        >>> s1.enrollCourse('PHYS 213', C)
        'Course added successfully'
        >>> print(s1.account)
        Name: Jason Lee
        ID: jl2890
        Balance: $12000
        >>> s1.account.chargeAccount(100)
        12100
        >>> s1.account.balance
        12100
        >>> s1.account.makePayment(200)
        11900
        >>> s1.getLoan(4000)
        >>> s1.account.balance
        7900
        >>> s1.getLoan(8000)
        >>> s1.account.balance
        -100
        >>> s1.enrollCourse('CMPEN 270', C)
        'Course added successfully'
        >>> s1.account.balance
        3900
        >>> s1.dropCourse('CMPEN 270')
        'Course dropped successfully'
        >>> s1.account.balance
        1900.0
        >>> s1.account.loans
        {27611: Balance: $4000, 84606: Balance: $8000}
        >>> StudentAccount.CREDIT_PRICE = 1500
        >>> s2 = Student('Thomas Wang', '123-45-6789', 'Freshman')
        >>> s2.registerSemester()
        >>> s2.enrollCourse('CMPSC 132', C)
        'Course added successfully'
        >>> s2.account.balance
        4500
        >>> s1.enrollCourse('CMPEN 270', C)
        'Course added successfully'
        >>> s1.account.balance
        7900.0
    '''
    
    def __init__(self, student):
        # YOUR CODE STARTS HERE
        self.student=student
        self.balance=0
        self.loans={}

    CREDIT_PRICE=1000

    def __str__(self):
        # YOUR CODE STARTS HERE
        id=self.student.id
        name=self.student.name
        return f"Name: {name}\nID: {id}\nBalance: ${self.balance}"
        

    __repr__ = __str__


    def makePayment(self, amount):
        # YOUR CODE STARTS HERE
        self.balance-=amount
        return self.balance
        

    def chargeAccount(self, amount):
        # YOUR CODE STARTS HERE
        self.balance+=amount
        return self.balance


if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=True)
