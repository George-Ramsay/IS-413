# Mission 09 - NCAA Basketball Teams (React MVP)

This project is a React app that displays NCAA college basketball teams from a JSON file.

## MVP Requirements Completed

1. Heading section introducing the site (`HeadingSection`)
2. Team card component showing:
	 - School Name
	 - Mascot Name
	 - Location (City, State)
3. Team list component rendering all cards (`TeamCardList`)
4. Data loaded from JSON file (`CollegeBasketballTeams.json`) instead of hardcoded constants

## Project Structure

```
Mission09_Ramsay/
	CollegeBasketballTeams.json
	index.html
	package.json
	src/
		App.jsx
		main.jsx
		styles.css
		components/
			HeadingSection.jsx
			TeamCard.jsx
			TeamCardList.jsx
```

## Run The App

From the `Mission09_Ramsay` folder:

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal (usually `http://localhost:5173`).

## Build For Production

```bash
npm run build
```

## Notes

- The JSON data source is imported directly in `src/App.jsx`.
- The app trims incoming text fields from the JSON before rendering cards.
- Styling is responsive and works on desktop and mobile.