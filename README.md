# stickyElement
JS Module for sticky elements

Requires jQuery
Use CSS transition on 'top' property for smooth scrolling

Performs better with jQuery resize plugin

Use: 
MODULE
stickyElement(selector [, yOffest]);

jQUERY PLUGIN
$(selector).stickyElement([yOffset]);

eg. 
.element {
	transition: top, 0.6s, ease-out;
}
