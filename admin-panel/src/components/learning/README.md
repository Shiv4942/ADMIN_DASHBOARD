# Learning Tools

A comprehensive learning management system that helps users track their courses, learning methods, and skills in one place.

## Features

### 1. Courses
- Add, edit, and delete courses
- Track progress with percentage completion
- Set course status (Not Started, In Progress, Completed)
- Add notes and links to course materials
- View course statistics

### 2. Learning Methods
- Track different learning techniques
- Log time spent on each method
- Rate effectiveness of methods (1-10)
- Add descriptions and tags for organization
- View usage statistics

### 3. Skills
- Track skill development progress
- Set skill levels (Beginner to Expert)
- Rate confidence for each skill (1-5)
- Log last practiced date
- Categorize and tag skills
- View skill statistics

## Components

### Main Components
- `LearningDashboard.jsx` - Main container component that manages state and renders the appropriate sub-components

### Course Components
- `CourseList.jsx` - Displays a list of courses with progress tracking
- `CourseForm.jsx` - Form for adding/editing courses

### Learning Method Components
- `LearningMethodList.jsx` - Displays learning methods with effectiveness ratings
- `LearningMethodForm.jsx` - Form for adding/editing learning methods

### Skill Components
- `SkillList.jsx` - Displays skills with confidence levels and last practiced dates
- `SkillForm.jsx` - Form for adding/editing skills

## API Integration

The components interact with the backend through the `learningService` which provides methods for:
- Fetching, creating, updating, and deleting courses
- Managing learning methods and tracking time spent
- Handling skill tracking and confidence levels
- Retrieving statistics and analytics

## Styling

Uses Tailwind CSS for styling with a consistent design system. Custom components include:
- Cards for displaying items
- Progress bars for tracking
- Responsive tables for data display
- Modal forms for adding/editing items

## State Management

- Local component state for form inputs and UI state
- API calls are managed through async/await with loading states
- Error handling with user feedback via toast notifications

## Accessibility

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Responsive design for all screen sizes

## Dependencies

- React (v17+)
- React Icons (Heroicons)
- Axios for API requests
- React Toastify for notifications
- Tailwind CSS for styling
