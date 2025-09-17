# Professional Resume Builder

A responsive and interactive Resume Builder website where users can create, edit, and download resumes. Built with modern web technologies and inspired by platforms like Overleaf.

## 🚀 Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Preview** - Live updates as you fill out the form
- **Multiple Templates** - Modern, Classic, Creative, and Professional designs
- **PDF Export** - Download your resume as a professional PDF
- **User Authentication** - Save progress and manage multiple resumes
- **Interactive Form** - Drag & drop sections, reorder experience and skills
- **Modern UI** - Beautiful, intuitive interface with Bootstrap 5

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3 (Flexbox/Grid for responsiveness)
- JavaScript (ES6+)
- Bootstrap 5 (responsive UI components)
- jQuery (for enhanced interactivity)
- FontAwesome (icons)
- Google Fonts

### Backend
- Python
- Flask (lightweight, beginner-friendly)
- SQLite (file-based database)

### Additional Tools
- jsPDF (PDF export functionality)
- HTML2Canvas (for PDF generation)

## 📁 Project Structure

```
resume-builder/
├── static/
│   ├── css/
│   │   ├── style.css
│   │   └── templates/
│   ├── js/
│   │   ├── main.js
│   │   ├── builder.js
│   │   └── pdf.js
│   ├── images/
│   └── fonts/
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── builder.html
│   ├── templates.html
│   ├── login.html
│   ├── signup.html
│   └── contact.html
├── app.py
├── models.py
├── requirements.txt
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-builder
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:5001`

## 📱 Pages

### Home Page
- Landing page with introduction and call-to-action
- Features showcase
- Navigation to all sections

### Resume Builder
- Interactive form for resume details
- Real-time preview
- Template selection
- PDF export functionality

### Templates
- Gallery of available resume templates
- Preview and selection interface

### Authentication
- User login and signup
- Password recovery
- User dashboard

### Contact
- Contact form for support
- FAQ section

## 🎨 Templates

1. **Modern** - Clean, minimalist design with bold typography
2. **Classic** - Traditional layout with professional styling
3. **Creative** - Colorful and innovative design
4. **Professional** - Corporate-style layout

## 🔧 Customization

### Adding New Templates
1. Create a new CSS file in `static/css/templates/`
2. Add template preview image to `static/images/templates/`
3. Update the templates configuration in `app.py`

### Modifying Styles
- Main styles: `static/css/style.css`
- Template-specific styles: `static/css/templates/`
- Bootstrap customization: Override variables in CSS

## 📄 PDF Export

The application uses jsPDF and HTML2Canvas to generate high-quality PDF exports:
- Maintains formatting and styling
- Optimized for A4 paper size
- Professional print quality

## 🔐 User Authentication

- Secure password hashing with bcrypt
- Session management
- User data persistence
- Password recovery functionality

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
1. Set up a production server (Heroku, DigitalOcean, etc.)
2. Configure environment variables
3. Set `FLASK_ENV=production`
4. Use a production WSGI server (Gunicorn)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Bootstrap for the responsive framework
- FontAwesome for icons
- Google Fonts for typography
- jsPDF for PDF generation

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact through the website contact form
- Email: support@resumebuilder.com

---

**Happy Resume Building! 🎉** 