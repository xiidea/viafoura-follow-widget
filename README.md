viafoura-follow-widget
======================

Easy Custom Follow Link Integration of Viafoura

Key Features
============
* Easy to integrate with any Application working with Viafoura
* Support Follow status!
* Next to zero configuration!!


Current Active Version
======================
v 0.1 Released!


Installation
------------

### Prequisites

 * [jQuery](http://www.jquery.com) - This is required by Viafoura Service it self.


### Required files

Copy `ViafouraFollowWidget.js` to your javascript folder.

Usage
-----

If you like demos more than a boring documentation see the `example.html` file and play with it.

The plugin can be called with jQuery in different ways.

### Standard call with default theme and settings:

    $('.myElement').ViafouraFollowWidget();

#### Html content and markup

any Html container tags(`<div>`,`<span>`, `<td>`) etc. can be used. replace {USERID} with appropriate viafoura user ID

    <div class="myElement" data-id="{USERID}"></div>

You can also provide the text in javascript for all link elements:

    $('.myElement').ViafouraFollowWidget({
                                           followLabelText:"Follow Link",
                                           unFollowLabelText:"Unfollow Link"
                                        });

You can change the default value for all options.


### Options

 * followLabelText: Text To show as Follow Link.
 * unFollowLabelText: Text To show as Un follow link.

Feedback
--------

Please send me an [email](mailto:roni@xiidea.net) or a tweet ‏@XiiDEA with any feedback you have.

This plugin is my first attempt at a custom widget for Viafoura Integrated System, so any ideas for improvement are welcome.


Contributing
------------

Contribute!