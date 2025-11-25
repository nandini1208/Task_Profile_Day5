# Nandini Gupta - Portfolio Website

A modern, responsive portfolio website showcasing my skills, experience, and projects as a Software Developer.

## 🌟 Features

- **Responsive Design** - Fully responsive across all devices (desktop, tablet, mobile)

- **Modern UI/UX** - Clean and professional design with smooth animations

- **Dark/Light Mode** - Toggle between dark and light themes

- **Interactive Elements** - Animated skill bars, project filters, and hover effects

- **Contact Form** - Functional contact form with message tracking

- **Mobile-Friendly Navigation** - Hamburger menu for mobile devices

- **Smooth Scrolling** - Seamless navigation between sections

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)

- **Icons**: Font Awesome 6.5.0

- **Fonts**: Google Fonts (Poppins)

- **Email Service**: EmailJS integration

- **Deployment**: GitHub Pages

## 📱 Sections

1\. **Home** - Introduction with profile image and social links

2\. **Professional Experience** - Work experience and achievements

3\. **Projects** - Filterable project showcase with categories

4\. **Technical Skills** - Animated skill bars and technology stack

5\. **Education & Certifications** - Academic background and certifications

6\. **Learning Journey** - Thinkbridge learning timeline and projects

7\. **Contact** - Contact form and information

## 🎯 Key Functionalities

### Navigation

- Fixed navigation bar with active section highlighting

- Smooth scroll to sections

- Mobile hamburger menu

- Scroll-to-top button

### Interactive Elements

- **Skill Bars**: Animated progress bars that fill on scroll

- **Project Filters**: Filter projects by technology (C#, Web, Database)

- **Theme Toggle**: Switch between dark and light modes

- **Contact Form**: Validated form with success/error messages

- **Message Counter**: Track received messages

### Animations

- Fade-in animations on page load

- Background bar animations

- Hover effects on cards and buttons

- Profile image circular animation

- Typing effect in hero section

## 📁 Project Structure

```

portfolio/

├── index.html          # Main HTML file
├── main.css            # All styles (responsive included)
├── script.js           # JavaScript functionality
├── image.jpg           # Profile image
├── Nandini_Gupta_CV.pdf # Resume file
└── certificates/       # Certificate files
    ├── certificate1.pdf
    ├── certificate2.pdf
    └── certificate3.pdf
```

## 🚀 Installation & Setup

1\. **Clone the repository**

```bash

git clone https://github.com/nandini1208/portfolio.git

```

2\. **Navigate to project directory**

```bash

cd portfolio

```

3\. **Open in browser**

- Simply open `index.html` in your web browser

- Or use a local server for better functionality

## 📧 Contact Form Setup

To enable the contact form:

1\. Create an EmailJS account

2\. Replace in `script.js`:

```

   // Replace with your actual EmailJS IDs

   const response = await emailjs.send(

     "YOUR_SERVICE_ID", 

     "YOUR_TEMPLATE_ID",

     {

       from_name: name,

       from_email: email,

       message: message,

       to_name: "Nandini",

     }

   );

```

## 🌐 Deployment

The portfolio is deployed on **GitHub Pages**:

🔗 **Live Demo**: [https://nandini1208.github.io/portfolio](https://nandini1208.github.io/portfolio)

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+

- **Tablet**: 768px - 1199px

- **Mobile**: 320px - 767px

## 🎨 Color Scheme

- **Primary**: #00ff88 (Green)

- **Background**: #061222 (Dark Blue)

- **Text**: #FFFFFF (White)

- **Cards**: rgba(255, 255, 255, 0.05) with backdrop blur

## 🔧 Customization

To customize for your own use:

1\. Update personal information in `index.html`

2\. Replace `image.jpg` with your profile photo

3\. Update project details and experience

4\. Modify color scheme in `main.css`

5\. Add your own certificate files

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: nandiniguptait1@gmail.com

- **LinkedIn**: [Nandini Gupta](https://www.linkedin.com/in/nandini-gupta-852357232/)

- **GitHub**: [nandini1208](https://github.com/nandini1208)

- **Phone**: +91 6307089359

---

⭐ **Star this repo if you find it helpful!**
