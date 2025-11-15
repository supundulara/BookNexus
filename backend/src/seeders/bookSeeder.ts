import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import Book from '../models/Book.js';

// Load environment variables
dotenv.config();

// Get database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: false
});

// Books data to seed
const books = [
  {
    title: "Harry Potter",
    author: "J. K. Rowling",
    isbn: "97812345678902",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyebm5c8f5eROOiSJpw0qy2cn97aLdeUllPw&s",
    subject: "Fiction",
    researchArea: "N/A",
    location: "Shelf B-15",
    totalCopies: 8,
    availableCopies: 5,
    description: "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends, Ron Weasley and Hermione Granger, all of whom are students at Hogwarts School of Witchcraft and Wizardry."
  },
  {
    title: "Python Crash Course",
    author: "Eric Matthes",
    isbn: "9781593279288",
    imageUrl: "https://img.drz.lazcdn.com/static/lk/p/e621b0f7f0860a4ae892f7556e97c91f.jpg_960x960q80.jpg_.webp",
    subject: "Programming",
    researchArea: "IT Related Books",
    location: "COM-1",
    totalCopies: 3,
    availableCopies: 1,
    description: null
  },
  {
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    isbn: "9781593279509",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaaBI39sms2Nh9sDoVEhDqnH4MfW8y6IM5ww&s",
    subject: "Programming",
    researchArea: "IT Related Books",
    location: "COM-1",
    totalCopies: 2,
    availableCopies: 1,
    description: null
  },
  {
    title: "JavaScript",
    author: "David Flanagan",
    isbn: "9781491952023",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqe7Y9oBDqq6FG8P3eMBqlRkt9-CThZcK6bA&s",
    subject: "Web Development",
    researchArea: "IT Related Books",
    location: "COM-1",
    totalCopies: 1,
    availableCopies: 1,
    description: "The Definitive Guide"
  },
  {
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    isbn: "9780553296983",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM3ZHItAJaNQ5pCb6Uz2Ru9dGhQtSgxVBkmckHyJ50-EKZEVcLIalZ99c8K0wCg0c3UuU&usqp=CAU",
    subject: "History & Politics",
    researchArea: "History",
    location: "H-1",
    totalCopies: 3,
    availableCopies: 1,
    description: "sad book"
  },
  {
    title: "Mathematics",
    author: "Timothy Gowers",
    isbn: "9780192853615",
    imageUrl: "https://m.media-amazon.com/images/I/81LmWBXmCzL._UF1000,1000_QL80_.jpg",
    subject: "Educational",
    researchArea: "Educational",
    location: "EM-1",
    totalCopies: 5,
    availableCopies: 2,
    description: " A Very Short Introduction"
  },
  {
    title: "Biology",
    author: "Campbell & Reece",
    isbn: "9780321775658",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1487159735i/31751688.jpg",
    subject: "Educational",
    researchArea: "Educational",
    location: "ES-2",
    totalCopies: 4,
    availableCopies: 3,
    description: null
  },
  {
    title: " To Kill a Mockingbird",
    author: "\tHarper Lee",
    isbn: "9780061120084",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
    subject: "Fiction",
    researchArea: "Fiction",
    location: "f2",
    totalCopies: 3,
    availableCopies: 3,
    description: "To Kill a Mockingbird is a 1960 Southern Gothic novel by American author Harper Lee.[1] It became instantly successful after its release; in the United States, it is widely read in high schools and middle schools"
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Sapiens-_A_Brief_History_of_Humankind.png",
    subject: "Non-Fiction",
    researchArea: "Non-Fiction",
    location: "NF-2",
    totalCopies: 4,
    availableCopies: 3,
    description: "Harari's work places human history within a framework, with the natural sciences setting limits for human activity and social sciences shaping what happens within those bounds. The academic discipline of history is the account of cultural change."
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "9780553380163",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a3/BriefHistoryTime.jpg",
    subject: "Science & Technology",
    researchArea: "Science",
    location: "S-1",
    totalCopies: 4,
    availableCopies: 3,
    description: "A Brief History of Time: From the Big Bang to Black Holes is a book on cosmology by the physicist Stephen Hawking, first published in 1988"
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRbRLUinhu-QLFMg6QgzeIQxrQKgZeALZHTE1Mkrg4HSfzqb14W",
    subject: "Science & Technology",
    researchArea: "Science",
    location: "S-1",
    totalCopies: 3,
    availableCopies: 4,
    description: "A Handbook of Agile Software Craftsmanship"
  },
  {
    title: "The Very Hungry Caterpillar",
    author: "Eric Carle",
    isbn: "9780399226908",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b5/HungryCaterpillar.JPG",
    subject: "Children's Books",
    researchArea: "Children's Books",
    location: "C-1",
    totalCopies: 10,
    availableCopies: 3,
    description: null
  },
  {
    title: "Learning PHP, MySQL & JavaScript",
    author: "Robin Nixon",
    isbn: "9781491978917",
    imageUrl: "https://m.media-amazon.com/images/I/91lbebRlqgL._UF1000,1000_QL80_.jpg",
    subject: "Web Development",
    researchArea: "IT Related Books",
    location: "COM-1",
    totalCopies: 2,
    availableCopies: 1,
    description: null
  },
  {
    title: "Charlotte's Web",
    author: "E.B. White",
    isbn: "9780064400558",
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1628267712i/24178.jpg",
    subject: "Children's Books",
    researchArea: "Children's Books",
    location: "C-2",
    totalCopies: 3,
    availableCopies: 1,
    description: null
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    imageUrl: "https://jumpbooks.lk/wp-content/uploads/2019/03/Atomic-Habits-1.jpg",
    subject: "Motivation",
    researchArea: "Self-Development",
    location: "M-1",
    totalCopies: 3,
    availableCopies: 1,
    description: null
  },
  {
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    isbn: "9780743269513",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzKsDH6C6suiYLtPDTECwjDKE6A2QhrwJFNA&s",
    subject: "Motivation",
    researchArea: "Self-Development",
    location: "S-1",
    totalCopies: 3,
    availableCopies: 1,
    description: null
  },
  {
    title: "The Bhagavad Gita",
    author: "Eknath Easwaran",
    isbn: "9781586380199",
    imageUrl: "https://m.media-amazon.com/images/I/81HR0LQ5ZmL._UF1000,1000_QL80_.jpg",
    subject: "Religion & Philosophy",
    researchArea: "Religion & Philosophy",
    location: "OTH-12",
    totalCopies: 2,
    availableCopies: 1,
    description: null
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    isbn: "9780486298238",
    imageUrl: "https://m.media-amazon.com/images/I/81DFDGzHZqL.jpg",
    subject: "Religion & Philosophy",
    researchArea: "Religion & Philosophy",
    location: "OTH-12",
    totalCopies: 1,
    availableCopies: 1,
    description: null
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9781503290563",
    imageUrl: "https://m.media-amazon.com/images/I/81Scutrtj4L._UF1000,1000_QL80_.jpg",
    subject: "Fiction",
    researchArea: "Fiction",
    location: "f2",
    totalCopies: 2,
    availableCopies: 0,
    description: null
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
    subject: "Fiction",
    researchArea: "Fiction",
    location: "f2",
    totalCopies: 3,
    availableCopies: 2,
    description: null
  },
  {
    title: "මඩොල් දූව",
    author: "Martin Wickramasinghe",
    isbn: " 9555640106",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKkNGFMbx2AJTfOLb7OUjYPuj_6sLfcV7Kdg&s",
    subject: "Fiction",
    researchArea: "Fiction",
    location: "f2",
    totalCopies: 4,
    availableCopies: 3,
    description: null
  },
  {
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    isbn: "9781337553292",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9WE0YVgFm6YBR2PMmduXsEZYNeZ66ien2OQ&s",
    subject: "Science & Technology",
    researchArea: "Science",
    location: "S-1",
    totalCopies: 4,
    availableCopies: 3,
    description: null
  },
  {
    title: "Head First Java",
    author: "Kathy Sierra & Bert Bates",
    isbn: "9780596009205",
    imageUrl: "https://www.oreilly.com/covers/urn:orm:book:9781492091646/400w/",
    subject: "Programming",
    researchArea: "IT Related Books",
    location: "COM-1",
    totalCopies: 3,
    availableCopies: 2,
    description: null
  },
  {
    title: "Loveena - ලොවීනා",
    author: "මොහාන් රාජ් මඩවල",
    isbn: "9789554690011",
    imageUrl: "https://www.kbooks.lk/image/cache/catalog/biso/loveena_mohan_raj_madawala-500x500.jpg",
    subject: "Fiction",
    researchArea: "Fiction",
    location: "f1",
    totalCopies: 4,
    availableCopies: 2,
    description: null
  },
  {
    title: "Educated",
    author: "Tara Westover",
    isbn: "9780399590504",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1f/Educated_%28Tara_Westover%29.png",
    subject: "Non-Fiction",
    researchArea: "Non-Fiction",
    location: "NF-2",
    totalCopies: 4,
    availableCopies: 0,
    description: "Educated is a 2018 memoir by American author Tara Westover. Westover recounts overcoming her survivalist Mormon family in order to go to college and emphasizes the importance of education in enlarging her world"
  },
  {
    title: "HTML & CSS",
    author: "Jon Duckett",
    isbn: "9781118008188",
    imageUrl: "https://m.media-amazon.com/images/I/613ZTDcDsiL._UF1000,1000_QL80_.jpg",
    subject: "Web Development",
    researchArea: "IT Related Books",
    location: "COM-1",
    totalCopies: 3,
    availableCopies: 0,
    description: "Design and Build Websites"
  }
];

async function seedBooks() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync the model with force to reset the table and auto-increment
    await Book.sync({ force: true });
    console.log('✅ Books table reset with ID sequence');
    
    // Create books
    for (const bookData of books) {
      const bookCreateData: any = {
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        imageUrl: bookData.imageUrl,
        subject: bookData.subject,
        researchArea: bookData.researchArea,
        location: bookData.location,
        totalCopies: bookData.totalCopies,
        availableCopies: bookData.availableCopies
      };
      
      if (bookData.description) {
        bookCreateData.description = bookData.description;
      }
      
      const newBook = await Book.create(bookCreateData);
      
      console.log(`✅ Book created: ${newBook.title} by ${newBook.author}`);
    }
    
    console.log(`\n✅ Seeding completed successfully! ${books.length} books added.`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    process.exit(0);
  }
}

// Run the seed function
seedBooks();