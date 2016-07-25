
<!---

This README is automatically generated from the comments in these files:
px-kit-button-light.html  px-kit-button.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

The bot does some handling of markdown. Please file a bug if it does the wrong
thing! https://github.com/PolymerLabs/tedium/issues

-->

[![Build status](https://travis-ci.org/PolymerElements/px-kit-button.svg?branch=master)](https://travis-ci.org/PolymerElements/px-kit-button)

_[Demo and API docs](https://elements.polymer-project.org/elements/px-kit-button)_


##&lt;px-kit-button&gt;

Material design: [Icon toggles](https://www.google.com/design/spec/components/buttons.html#buttons-toggle-buttons)

`px-kit-button` is a button with an image placed at the center. When the user touches
the button, a ripple effect emanates from the center of the button.

`px-kit-button` includes a default icon set.  Use `icon` to specify which icon
from the icon set to use.

```html
<px-kit-button icon="menu"></px-kit-button>
```

See [`iron-iconset`](iron-iconset) for more information about
how to use a custom icon set.

Example:

```html
<link href="path/to/iron-icons/iron-icons.html" rel="import">

<px-kit-button icon="favorite"></px-kit-button>
<px-kit-button src="star.png"></px-kit-button>
```

To use `px-kit-button` as a link, wrap it in an anchor tag. Since `px-kit-button`
will already receive focus, you may want to prevent the anchor tag from receiving focus
as well by setting its tabindex to -1.

```html
<a href="https://www.polymer-project.org" tabindex="-1">
  <px-kit-button icon="polymer"></px-kit-button>
</a>
```

### Styling

Style the button with CSS as you would a normal DOM element. If you are using the icons
provided by `iron-icons`, they will inherit the foreground color of the button.

```html
/* make a red "favorite" button */
<px-kit-button icon="favorite" style="color: red;"></px-kit-button>
```

By default, the ripple is the same color as the foreground at 25% opacity. You may
customize the color using the `--px-kit-button-ink-color` custom property.

The following custom properties and mixins are available for styling:

| Custom property | Description | Default |
| --- | --- | --- |
| `--px-kit-button-disabled-text` | The color of the disabled button | `--disabled-text-color` |
| `--px-kit-button-ink-color` | Selected/focus ripple color | `--primary-text-color` |
| `--px-kit-button` | Mixin for a button | `{}` |
| `--px-kit-button-disabled` | Mixin for a disabled button | `{}` |
| `--px-kit-button-hover` | Mixin for button on hover | `{}` |



<!-- No docs for <px-kit-button-light> found. -->
