/*
 * jquery.visharing.js | Improved social sharing
 * Virtual Identity AG - Jonathan Weiß
 *
 * Based on:
 * jquery.socialshareprivacy.js | 2 Klicks fuer mehr Datenschutz
 *
 * http://www.heise.de/extras/socialshareprivacy/
 * http://www.heise.de/ct/artikel/2-Klicks-fuer-mehr-Datenschutz-1333879.html
 *
 * Copyright (c) 2011 Hilko Holweg, Sebastian Hilbig, Nicolas Heiringhoff, Juergen Schmidt,
 * Heise Zeitschriften Verlag GmbH & Co. KG, http://www.heise.de
 *
 * is released under the MIT License http://www.opensource.org/licenses/mit-license.php
 *
 * Spread the word, link to us if you can.
 */
(function($){
    $.fn.viSharing = function(options){
        var defaults = {
            'services' : {
                'facebook' : {
                    'status'            : 'on',
                    'app_id'            : '__FB_APP-ID__',
                    'dummy_img'         : 'socialshareprivacy/images/dummy_facebook.png',
                    'txt_info'          : '<p><em style="color:green;">Dies ist ein Mustertext ohne Gewähr. Bitte stimmen Sie den von Ihnen verwendeten Text mit Ihrem Datenschutzbeauftragten ab.</em><br/>Bereits durch das Anzeigen des Like-Buttons werden personenbeziehbare und eventuell auch personenbezogenen Daten von mir an Facebook in die USA übertragen. Des Weiteren werden Cookies eingesetzt, deren Funktionalität von Facebook nicht vollständig und abschließend geklärt ist.<br />Beachten Sie bitte auch die Informationen in der <a href="details.html" target="_blank">Datenschutzerklärung</a>.<br />Ich stimme diesen Datenübertragungen (bis auf Widerruf) zu.</p><input class="btn" rel="fb-ok" type="button" value="OK, einverstanden" /> <input class="btn" rel="fb-cancel" type="button" value="Abbrechen" />',
                    'txt_fb_off'        : 'nicht mit Facebook verbunden',
                    'txt_fb_on'         : 'mit Facebook verbunden',
                    'perma_option'      : 'on',
                    'display_name'      : 'Facebook',
                    'referrer_track'    : '',
                    'language'          : 'de_DE',
                    'action'            : 'like'
                }, 
                'twitter' : {
                    'status'            : 'on', 
                    'dummy_img'         : 'socialshareprivacy/images/dummy_twitter.png',
                    'txt_info'          : '<p><em style="color:green;">Dies ist ein Mustertext ohne Gewähr. Bitte stimmen Sie den von Ihnen verwendeten Text mit Ihrem Datenschutzbeauftragten ab.</em><br/>Bereits durch das Anzeigen des Tweet-Buttons werden personenbeziehbare und eventuell auch personenbezogenen Daten von mir an Twitter in die USA übertragen. Des Weiteren werden Cookies eingesetzt, deren Funktionalität von Twitter nicht vollständig und abschließend geklärt ist.<br />Ich stimme diesen Datenübertragungen (bis auf Widerruf) zu.</p><input class="btn" rel="tw-ok" type="button" value="OK, einverstanden" /> <input class="btn" rel="tw-cancel" type="button" value="Abbrechen" />',
                    'txt_twitter_off'   : 'nicht mit Twitter verbunden',
                    'txt_twitter_on'    : 'mit Twitter verbunden',
                    'perma_option'      : 'on',
                    'display_name'      : 'Twitter',
                    'referrer_track'    : '', 
                    'tweet_text'        : getTweetText
                },
                'gplus' : {
                    'status'            : 'on',
                    'dummy_img'         : 'socialshareprivacy/images/dummy_gplus.png',
                    'txt_info'          : '<p><em style="color:green;">Dies ist ein Mustertext ohne Gewähr. Bitte stimmen Sie den von Ihnen verwendeten Text mit Ihrem Datenschutzbeauftragten ab.</em><br/>Bereits durch das Anzeigen des +1-Buttons werden personenbeziehbare und eventuell auch personenbezogenen Daten von mir an Google in die USA übertragen. Des Weiteren werden Cookies eingesetzt, deren Funktionalität von Google nicht vollständig und abschließend geklärt ist.<br />Ich stimme diesen Datenübertragungen (bis auf Widerruf) zu.</p><input class="btn" rel="g-ok" type="button" value="OK, einverstanden" /> <input class="btn" rel="g-cancel" type="button" value="Abbrechen" />',
                    'txt_gplus_off'     : 'nicht mit Google+ verbunden',
                    'txt_plus_on'       : 'mit Google+ verbunden',
                    'perma_option'      : 'on',
                    'display_name'      : 'Google+',
                    'referrer_track'    : '',
                    'language'          : 'de'
                }
            },
            'info_link'         : 'http://www.heise.de/ct/artikel/2-Klicks-fuer-mehr-Datenschutz-1333879.html',
            'txt_help'          : 'Wenn Sie die Häkchen setzen, werden künftig personenbeziehbare oder personenbezogene Daten von Ihnen auch bei künftigen Besuch dieses Webauftritts an Facebook, Twitter oder Google gesendet, ohne dass Sie in der Zukunft noch einmal explizit einwilligen müssen. Zu diesem Zweck wird beim Aktivieren einer Checkbox ein Cookie gesetzt. Durch Deaktivieren der Checkbox wird dieses Cookie wieder entfernt.<br />Von Facebook, Twitter und Google werden jeweils auch Cookies eingesetzt. Beachten Sie bitte auch die Informationen in der Datenschutzerklärung.<br />Ich stimme diesen Datenübertragungen auch für die Zukunft (bis auf Widerruf) zu.',
            'settings_perma'    : 'Dauerhaft aktivieren und Daten&uuml;ber&shy;tragung zustimmen:',
            'cookie_path'       : '/',
            'cookie_domain'     : document.location.host,
            'cookie_expires'    : '365',
            'css_path'          : 'socialshareprivacy/socialshareprivacy.css'
        };

        // Standardwerte des Plug-Ings mit den vom User angegebenen Optionen ueberschreiben
        var options = $.extend(true, defaults, options);

        if((options.services.facebook.status == 'on' && options.services.facebook.app_id != '__FB_APP-ID__') || options.services.twitter.status == 'on' || options.services.gplusone.status == 'on'){
            $('head').append('<link rel="stylesheet" type="text/css" href="'+options.css_path+'" />');
            $(this).prepend('<ul class="social_share_privacy_area"></ul>');
            var context = $('.social_share_privacy_area', this);
            
            // als URL wird erstmal die derzeitige Dokument-URL angenommen
            var uri = document.location.href;
            
            // ist eine kanonische URL hinterlegt wird diese verwendet
            var canonical = $('link[rel="canonical"]').attr("href");
            if (canonical && canonical.length > 0) {
                if (canonical.indexOf("http") < 0) {
                    canonical = document.location.protocol + "//" + document.location.host + canonical;
                }
                uri = canonical;
            }
        }

        // Text kuerzen und am Ende mit \u2026 (horizontal ellipsis) versehen, sofern er abgekuerzt werden musste
        function abbreviateText(text, length){
            var abbreviated = decodeURIComponent(text);
            if(abbreviated.length <= length){
                return text;
            }

            var lastWhitespaceIndex = abbreviated.substring(0, length - 1).lastIndexOf(' ');
            abbreviated = encodeURIComponent(abbreviated.substring(0, lastWhitespaceIndex)) + "\u2026";

            return abbreviated;
        }

        // Meta-Wert abfragen
        function getMeta(name){
            var metaContent = jQuery('meta[name="' + name + '"]').attr('content');
            return metaContent ? metaContent : '';
        }
        
        // Tweet-Text
        function getTweetText(){
            // Titel aus <meta name="DC.title"> und <meta name="DC.creator"> wenn vorhanden, sonst <title>
            var title = getMeta('DC.title');
            var creator = getMeta('DC.creator');
            if(title.length > 0){
                if(creator.length > 0){
                    title = title+' - '+creator;
                }
            }
            else{
                title = $('title').text();
            }
            return encodeURIComponent(title);
        }

        function storeAcknowledge(type) {
            // An dieser Stelle muss die Zustimmung serverseitig mit einer teilanonymisierten IP-Adresse des Users
            // gespeichert werden.
            // Dazu kann einfach an dieser Stelle ein GET-Request erfolgen, der dann serverseitig die Speicherung
            // übernimmt. Type ist "fb_like", "tweet" oder "gplusone", wenn der User auf einen der Buttons geklickt hat
            // und "facebook", "twitter" oder "gplus", wenn er eine Checkbox angeklickt hat.

            //$.get('/saveAcknowledge?type=' + type);
        }

        function btnClick(e) {
            if ($(this).index() == 1) {
                $(e.target).closest('.help_info').find('.switch').click();
                var type = $(e.target).closest('.help_info').find('.dummy_btn').attr('class').split(' ')[0];
                storeAcknowledge(type);
            } else {
                 $(e.target).closest('.help_info').removeClass('display');
            }
        }

        function cbMousedown(e) {

            var el =  $(e.target).is('label')? $(e.target).parent().find('#' + $(e.target).attr('for')) : $(e.target);

            if (el.attr('checked') != 'checked') {
                var selector = '';

                if (el.attr('name') == 'perma_status_facebook') {
                    selector = 'facebook';
                } else if (el.attr('name') == 'perma_status_twitter') {
                    selector = 'twitter';
                } else {
                    selector = 'gplus';
                }

                var left = Math.round((el.closest('li').position().left + el.closest('li').find('div').outerWidth()) / 2);
                var layer = $('#socialshareprivacy .cb_layer').length ? $('#socialshareprivacy .cb_layer') : $('<div class="cb_layer info" />').
                    appendTo('#socialshareprivacy .social_share_privacy_area');

                var pos = el.closest('li').position();
                var left = (pos.left - layer.outerWidth()) +  el.closest('li').find('div').outerWidth();
                function onClick(){
                    if ($(this).index() == 1) {
                        storeAcknowledge(selector);
                        el.attr('checked', true);
                        $('#socialshareprivacy input[name=' + el.attr('name') + ']').click();
                        el.attr('checked', true);
                    }
                    layer.hide().find('input').unbind('click', onClick);
                }

                layer.
                    html($('#socialshareprivacy li.' + selector +' .info').html()).
                    show().
                    data('type', selector).
                    css({
                        'left' : left + 'px',
                        'top' : pos.top + 'px'
                    }).find('input').click(onClick);

            }
        }

        return this.each(function(){
            // Facebook
            if(options.services.facebook.status == 'on'){
                // Kontrolle ob Facebook App-ID hinterlegt ist, da diese noetig fuer den Empfehlen-Button ist
                if(options.services.facebook.app_id != '__FB_APP-ID__'){
                    var fb_enc_uri = encodeURIComponent(uri+options.services.facebook.referrer_track);
                    var fb_code = '<iframe src="http://www.facebook.com/plugins/like.php?locale='+options.services.facebook.language+'&amp;app_id='+options.services.facebook.app_id+'&amp;href='+fb_enc_uri+'&amp;send=false&amp;layout=button_count&amp;width=120&amp;show_faces=false&amp;action='+options.services.facebook.action+'&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe>';
                    var fb_dummy_btn = '<img src="'+options.services.facebook.dummy_img+'" alt="Facebook &quot;Like&quot;-Dummy" class="fb_like_privacy_dummy" />';

                    context.append('<li class="facebook help_info"><span class="info">'+options.services.facebook.txt_info+'</span><span class="switch off">'+options.services.facebook.txt_fb_off+'</span><div class="fb_like dummy_btn">'+fb_dummy_btn+'</div></li>');

                    var $container_fb = $('li.facebook', context);

                    $('li.facebook div.fb_like img.fb_like_privacy_dummy,li.facebook span.switch', context).live('click', function(){
                        if($container_fb.find('span.switch').hasClass('off')){
                            $container_fb.addClass('info_off');
                            $container_fb.find('span.switch').addClass('on').removeClass('off').html(options.services.facebook.txt_fb_on);
                            $container_fb.find('img.fb_like_privacy_dummy').replaceWith(fb_code);
                        }
                        else{
                            $container_fb.removeClass('info_off');
                            $container_fb.find('span.switch').addClass('off').removeClass('on').html(options.services.facebook.txt_fb_off);
                            $container_fb.find('.fb_like').html(fb_dummy_btn);
                        }
                    });

                }
                else{
                    try{
                        console.log('Fehler: Es ist keine Facebook App-ID hinterlegt.');
                    }
                    catch(e){ }
                }
            }

            // Twitter
            if(options.services.twitter.status == 'on'){
                // 120 = Restzeichen-Anzahl nach automatischem URL-Kuerzen durch Twitter mit t.co
                var text = options.services.twitter.tweet_text;
                if(typeof(text) == 'function'){
                    text = text();
                }
                text = abbreviateText(text,'120');
                
                var twitter_enc_uri = encodeURIComponent(uri+options.services.twitter.referrer_track);
                var twitter_count_url = encodeURIComponent(uri);
                var twitter_code = '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?url='+twitter_enc_uri+'&amp;counturl='+twitter_count_url+'&amp;text='+text+'&amp;count=horizontal"></iframe>';
                var twitter_dummy_btn = '<img src="'+options.services.twitter.dummy_img+'" alt="&quot;Tweet this&quot;-Dummy" class="tweet_this_dummy" />';
                
                context.append('<li class="twitter help_info"><span class="info">'+options.services.twitter.txt_info+'</span><span class="switch off">'+options.services.twitter.txt_twitter_off+'</span><div class="tweet dummy_btn">'+twitter_dummy_btn+'</div></li>');

                var $container_tw = $('li.twitter', context);
                
                $('li.twitter div.tweet img,li.twitter span.switch', context).live('click', function(){
                    if($container_tw.find('span.switch').hasClass('off')){
                        $container_tw.addClass('info_off');
                        $container_tw.find('span.switch').addClass('on').removeClass('off').html(options.services.twitter.txt_twitter_on);
                        $container_tw.find('img.tweet_this_dummy').replaceWith(twitter_code);
                    }
                    else{
                        $container_tw.removeClass('info_off');
                        $container_tw.find('span.switch').addClass('off').removeClass('on').html(options.services.twitter.txt_twitter_off);
                        $container_tw.find('.tweet').html(twitter_dummy_btn);
                    }
                });
            }

            // Google+
            if(options.services.gplus.status == 'on'){
                // fuer G+ wird die URL nicht encoded, da das zu einem Fehler fuehrt
                var gplus_uri = uri+options.services.gplus.referrer_track;
                var gplus_code = '<div class="g-plusone" data-size="medium" data-href="'+gplus_uri+'"></div><script type="text/javascript">window.___gcfg = {lang: "'+options.services.gplus.language+'"}; (function(){ var po = document.createElement("script"); po.type = "text/javascript"; po.async = true; po.src = "https://apis.google.com/js/plusone.js"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s); })(); </script>';
                var gplus_dummy_btn = '<img src="'+options.services.gplus.dummy_img+'" alt="&quot;Google+1&quot;-Dummy" class="gplus_one_dummy" />';

                context.append('<li class="gplus help_info"><span class="info">'+options.services.gplus.txt_info+'</span><span class="switch off">'+options.services.gplus.txt_gplus_off+'</span><div class="gplusone dummy_btn">'+gplus_dummy_btn+'</div></li>');

                var $container_gplus = $('li.gplus', context);

                $('li.gplus div.gplusone img,li.gplus span.switch', context).live('click', function(){
                    if($container_gplus.find('span.switch').hasClass('off')){
                        $container_gplus.addClass('info_off');
                        $container_gplus.find('span.switch').addClass('on').removeClass('off').html(options.services.gplus.txt_gplus_on);
                        $container_gplus.find('img.gplus_one_dummy').replaceWith(gplus_code);
                    }
                    else{
                        $container_gplus.removeClass('info_off');
                        $container_gplus.find('span.switch').addClass('off').removeClass('on').html(options.services.gplus.txt_gplus_off);
                        $container_gplus.find('.gplusone').html(gplus_dummy_btn);
                    }
                });
            }

            // Der Info/Settings-Bereich wird eingebunden
            context.append('<li class="settings_info"><div class="settings_info_menu off perma_option_off"><a href="'+options.info_link+'"><span class="help_info icon"><span class="info">'+options.txt_help+'</span></span></a></div></li>');

            // Mouseup auf die Buttons "OK" und "Abbrechen"
            $('.help_info input').live('click', btnClick);

            // Info-Overlays einblenden
            $('.help_info:not(.info_off)', context).live('mouseenter', function(){
                var $info_wrapper = $(this);
                $('#socialshareprivacy .facebook.help_info.display').removeClass('display');
                $(this).addClass('display');
                $('#socialshareprivacy .cb_layer').hide();
            });

            $('.help_info', context).live('mouseleave', function(){
                var timeout_id = $(this).data('timeout_id');
                window.clearTimeout(timeout_id);
                if($(this).hasClass('display')){
                    $(this).removeClass('display');
                }
            });

            // Menue zum dauerhaften Einblenden der aktiven Dienste via Cookie einbinden
            // Die IE7 wird hier ausgenommen, da er kein JSON kann und die Cookies hier ueber JSON-Struktur abgebildet werden
            if(((options.services.facebook.status == 'on' && options.services.facebook.perma_option == 'on' && options.services.facebook.app_id != '__FB_APP-ID__') || (options.services.twitter.status == 'on' && options.services.twitter.perma_option == 'on') || (options.services.gplus.status == 'on' && options.services.gplus.perma_option == 'on')) && (($.browser.msie && $.browser.version > 7.0) || !$.browser.msie)){
                // Cookies abrufen
                var cookie_list = document.cookie.split(';');
                var cookies = '{';
                for(var i = 0; i < cookie_list.length; i++){
                    var foo = cookie_list[i].split('=');
                    cookies+='"'+$.trim(foo[0])+'":"'+$.trim(foo[1])+'"';
                    if(i < cookie_list.length-1){
                        cookies += ',';
                    }
                }
                cookies += '}';
                cookies = JSON.parse(cookies);


                // Cookie setzen
                function cookieSet(name,value,days,path,domain){
                    var expires = new Date();
                    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
                    document.cookie = name+'='+value+'; expires='+expires.toUTCString()+'; path='+path+'; domain='+domain;
                }

                // Cookie loeschen
                function cookieDel(name,value){
                    var expires = new Date();
                    expires.setTime(expires.getTime() - 100);
                    document.cookie = name+'='+value+'; expires='+expires.toUTCString()+'; path='+options.cookie_path+'; domain='+options.cookie_domain;
                }

                // Container definieren
                var $container_settings_info = $('li.settings_info', context);

                // Klasse entfernen, die das i-Icon alleine formatiert, da Perma-Optionen eingeblendet werden
                $container_settings_info.find('.settings_info_menu').removeClass('perma_option_off');

                // Perma-Optionen-Icon (.settings) und Formular (noch versteckt) einbinden
                $container_settings_info.find('.settings_info_menu').append('<span class="settings">Einstellungen</span><form><fieldset><legend>'+options.settings_perma+'</legend></fieldset></form>');

                // Die Dienste mit <input> und <label>, sowie checked-Status laut Cookie, schreiben
                if(options.services.facebook.status == 'on' && options.services.facebook.perma_option == 'on' && options.services.facebook.app_id != '__FB_APP-ID__'){
                    var perma_status_facebook = '';
                    cookies.socialSharePrivacy_facebook == 'perma_on' ? perma_status_facebook = ' checked="checked"' : perma_status_facebook = '';
                    $container_settings_info.find('form fieldset').append('<input type="checkbox" name="perma_status_facebook" id="perma_status_facebook"'+perma_status_facebook+' /><label for="perma_status_facebook">'+options.services.facebook.display_name+'</label>');
                }
                if(options.services.twitter.status == 'on' && options.services.twitter.perma_option == 'on'){
                    var perma_status_twitter = '';
                    cookies.socialSharePrivacy_twitter == 'perma_on' ? perma_status_twitter = ' checked="checked"' : perma_status_twitter = '';
                    $container_settings_info.find('form fieldset').append('<input type="checkbox" name="perma_status_twitter" id="perma_status_twitter"'+perma_status_twitter+' /><label for="perma_status_twitter">'+options.services.twitter.display_name+'</label>');
                }
                if(options.services.gplus.status == 'on' && options.services.gplus.perma_option == 'on'){
                    var perma_status_gplus = '';
                    cookies.socialSharePrivacy_gplus == 'perma_on' ? perma_status_gplus = ' checked="checked"' : perma_status_gplus = '';
                    $container_settings_info.find('form fieldset').append('<input type="checkbox" name="perma_status_gplus" id="perma_status_gplus"'+perma_status_gplus+' /><label for="perma_status_gplus">'+options.services.gplus.display_name+'</label>');
                }

                // Mouselicks auf die Checkboxen
                $container_settings_info.find('input, label').live('mousedown', cbMousedown);
                
                // Cursor auf Pointer setzen fuer das Zahnrad
                $container_settings_info.find('span.settings').css('cursor','pointer');

                // Einstellungs-Menue bei mouseover ein-/ausblenden
                $($container_settings_info.find('span.settings'), context).live('mouseenter', function(){
                    var timeout_id = window.setTimeout(function(){ $container_settings_info.find('.settings_info_menu').removeClass('off').addClass('on'); }, 500);
                    $(this).data('timeout_id',timeout_id);
                }); 
                $($container_settings_info, context).live('mouseleave', function(){
                    var timeout_id = $(this).data('timeout_id');
                    window.clearTimeout(timeout_id);
                    $container_settings_info.find('.settings_info_menu').removeClass('on').addClass('off');
                });

                // Klick-Interaktion auf <input> um Dienste dauerhaft ein- oder auszuschalten (Cookie wird gesetzt oder geloescht)
                $($container_settings_info.find('fieldset input')).live('click', function(event){
                    var value;
                    var click = event.target.id;
                    service = click.substr(click.lastIndexOf('_')+1, click.length);

                    $('#'+event.target.id+':checked').length ? value = 'on' : value = 'off';

                    var cookie_name = 'socialSharePrivacy_'+service;

                    if(value == 'on'){
                        // Cookie setzen
                        cookieSet(cookie_name,'perma_on',options.cookie_expires,options.cookie_path,options.cookie_domain);
                        $('form fieldset label[for='+click+']', context).addClass('checked');
                    }
                    else{
                        // Cookie loeschen
                        cookieDel(cookie_name,'perma_on');
                        $('form fieldset label[for='+click+']', context).removeClass('checked');
                    }
                });

                // Dienste automatisch einbinden, wenn entsprechendes Cookie vorhanden ist
                if(options.services.facebook.status == 'on' && options.services.facebook.perma_option == 'on' && cookies.socialSharePrivacy_facebook == 'perma_on' && options.services.facebook.app_id != '__FB_APP-ID__'){
                    $('li.facebook span.switch', context).click();
                }
                if(options.services.twitter.status == 'on' && options.services.twitter.perma_option == 'on' && cookies.socialSharePrivacy_twitter == 'perma_on'){
                    $('li.twitter span.switch', context).click();
                }
                if(options.services.gplus.status == 'on' && options.services.gplus.perma_option == 'on' && cookies.socialSharePrivacy_gplus == 'perma_on'){
                    $('li.gplus span.switch', context).click();
                }
            }
        });
    }
})(jQuery);
