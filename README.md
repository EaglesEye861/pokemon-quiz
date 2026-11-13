# Pokémon Challenge — Who's That Pokémon?

A responsive **"Who's That Pokémon?"** browser quiz game built with HTML, CSS, and vanilla JavaScript, featuring **Easy** and **Hard** difficulty modes and persistent score and streak tracking.

## Features

* **Two Difficulty Modes:**
  * **Easy Mode:** Shows the full-color Pokémon image.
  * **Hard Mode:** Shows only a dark black shadow outline of the Pokémon until you submit your guess.
* **Persistent Score & Streak Tracking:** Saves your **Score** (+5 points per correct answer), **Streak**, and **Max Streak** separately for Easy and Hard modes using `localStorage`.
* **Responsive Layout & Controls:** Adapts cleanly to both desktop and mobile screens without unwanted scrolling, keeps the keyboard active between guesses, and provides tactile button press feedback.

## Project Structure

```text
├── index.html   # Mode selection menu (Easy / Hard)
├── hard.html    # Main Pokémon Quiz gameplay screen
├── style.css    # Responsive card layout and Pokédex-inspired styling
├── game.js      # Game logic, data fetching, and localStorage state
├── menu.webp    # Menu screen artwork
└── frame.png    # Gameplay stage background
```

## Credits & Acknowledgements

* **Pokémon Data & Sprites:** PokéAPI
* **Menu & Frame Artwork:** Pokémon / Nintendo / Creatures Inc. / GAME FREAK inc. (fan-sourced visuals)
* **Reset Popup Icon:** Flaticon
* **Popups:** SweetAlert2
* **Typography:** Roboto (Google Fonts)

## License & Copyright

Copyright (c) 2026. All original source code (`HTML`, `CSS`, and `JavaScript`) in this repository is licensed under the **MIT License** — see the `LICENSE` file for full details. Third-party images and game assets remain the property of their respective copyright holders.

## Disclaimer

This is a non-commercial, fan-made educational project. Pokémon, character names, and official artwork/imagery are trademarks and copyrights of **Nintendo**, **Creatures Inc.**, and **GAME FREAK inc.**
