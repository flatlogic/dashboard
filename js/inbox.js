/**
 * todo this app will be REWRITTEN in the next release to angular version
 */
$(function(){
    var bs3Wysihtml5Templates = {
        "emphasis": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
                "<div class='btn-group'>" +
                "<a class='btn btn-" + size + " btn-default' data-wysihtml5-command='bold' title='CTRL+B' tabindex='-1'><i class='glyphicon glyphicon-bold'></i></a>" +
                "<a class='btn btn-" + size + " btn-default' data-wysihtml5-command='italic' title='CTRL+I' tabindex='-1'><i class='glyphicon glyphicon-italic'></i></a>" +
                "</div>" +
                "</li>";
        },
        "link": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
                ""+
                "<div class='bootstrap-wysihtml5-insert-link-modal modal fade'>" +
                "<div class='modal-dialog'>"+
                "<div class='modal-content'>"+
                "<div class='modal-header'>" +
                "<a class='close' data-dismiss='modal'>&times;</a>" +
                "<h4>" + locale.link.insert + "</h4>" +
                "</div>" +
                "<div class='modal-body'>" +
                "<input value='http://' class='bootstrap-wysihtml5-insert-link-url form-control'>" +
                "<label class='checkbox'> <input type='checkbox' class='bootstrap-wysihtml5-insert-link-target' checked>" + locale.link.target + "</label>" +
                "</div>" +
                "<div class='modal-footer'>" +
                "<button class='btn btn-default' data-dismiss='modal'>" + locale.link.cancel + "</button>" +
                "<button href='#' class='btn btn-primary' data-dismiss='modal'>" + locale.link.insert + "</button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<a class='btn btn-" + size + " btn-default' data-wysihtml5-command='createLink' title='" + locale.link.insert + "' tabindex='-1'><i class='fa fa-share'></i></a>" +
                "</li>";
        },
        "html": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
                "<div class='btn-group'>" +
                "<a class='btn btn-" + size + " btn-default' data-wysihtml5-action='change_view' title='" + locale.html.edit + "' tabindex='-1'><i class='fa fa-pencil'></i></a>" +
                "</div>" +
                "</li>";
        }
    };

    var dummyBodies = ["<p>Why painful the sixteen how minuter looking nor. Subject but why ten earnest husband imagine sixteen brandon. Are unpleasing occasional celebrated motionless unaffected conviction out. Evil make to no five they. Stuff at avoid of sense small fully it whose an. Ten scarcely distance moreover handsome age although. As when have find fine or said no mile. He in dispatched in imprudence dissimilar be possession unreserved insensible. She evil face fine calm have now. Separate screened he outweigh of distance landlord.</p>",
        "somm text bodt. Reall small. ust few lines", "<p>Lose john poor same it case do year we. Full how way even the sigh. Extremely nor furniture fat questions now provision incommode preserved. Our side fail find like now. Discovered travelling for insensible partiality unpleasing impossible she. Sudden up my excuse to suffer ladies though or. Bachelor possible marianne directly confined relation as on he.</p>",
        "empty"];

    function initMailboxApp(){
        "use strict";

        var STARRED_FOLDER_ID = 33;

        var Email = Backbone.Model.extend({

            defaults:function(){
                return {
                    sender: '',
                    senderMail: '',
                    subject: '',
                    body: dummyBodies[Math.round(Math.random()*3)],
                    receiver: '',
                    timestamp: new Date(new Date().getTime() - 2*60*60*1000).getTime(),  //two hours ago
                    read: true,
                    starred: false,
                    attachment: false,
                    folderId: 1,

                    selected:false
                }
            },
            markRead: function() {
                this.save( {read: true } );
            },

            toggleStarred: function() {
                this.save( { starred: !this.get("starred")} );
            },

            toggleSelected: function(){
                this.save( {selected: !this.get("selected")});
            }
        });


        var Folder = Backbone.Model.extend({

            defaults: {
                name: '',
                current: false,
                order: 3,
                unread: 0
            },

            sync: function(){
                //just swallow this call
            }
        });

        var FolderList = Backbone.Collection.extend({

            model: Folder,

            url: 'demo/json/folders.json',


            comparator: 'order',

            parse: function(response){
                //add fake starred folder
                response.push({name: 'Starred', id: STARRED_FOLDER_ID, order: 4});
                return response;
            }
        });

        var Folders = new FolderList();

        var FolderView = Backbone.View.extend({

            tagName:  "li",

            template: _.template($('#folder-template').html()),

            events: {
                "click": 'selectFolder'
            },


            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {
                this.$el.attr('class', this.model.get("current") ? 'active' : '');
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },


            selectFolder: function(e){
                var that = this;
                Folders.each(function(folder){
                    folder.save({current: folder == that.model})
                });
                App.showEmailsView();
                e.preventDefault(); // add as a temporary fix while making angular inbox version
            }

        });

        var EmailList = window.EmailList = Backbone.Collection.extend({

            model: Email,

            url: 'demo/json/emails.json',


            comparator: function(mail){
                return -mail.get('timestamp');
            },

            search: function(word, folderId){
                if (word=="") return this.where({folderId: folderId});

                var pat = new RegExp(word, 'gi');
                return this.filter( function(mail) {
                        return mail.get("folderId") == folderId && pat.test(mail.get('subject')) || pat.test(mail.get('sender'));
                    }
                );
            }

        });

        var Emails = new EmailList();

        var EmailView = Backbone.View.extend({

            tagName:  "tr",

            template: _.template($('#mail-item-template').html()),


            events: {
                "change .selected-checkbox": 'toggleSelected',
                "click .starred": 'toggleStarred',
                "click .name,.subject": 'openEmail'
            },


            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {
                this.$el.attr('class', this.model.get("read") ? '' : 'unread');
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },


            formatDate: function(dateInt){
                var date = new Date(dateInt),
                    now = new Date(),
                    todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                if (date.getTime() > todayStart){
                    return date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                }
                return ['Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()] + ' ' + date.getDate();
            },

            toggleSelected: function(){
                this.model.toggleSelected();
            },

            toggleStarred: function(){
                this.model.toggleStarred();
            },

            openEmail: function(){
                this.model.save({read: true});
                App.setCurrentView(new EmailOpenedView({model: this.model}));
            }

        });

        var EmailOpenedView = Backbone.View.extend({


            template: _.template($('#email-view-template').html()),

            attributes: {
                id: 'email-view',
                class: 'email-view'
            },

            events: {
                "click #email-opened-reply": 'replyEmail'
            },


            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {
                $('#widget-email-header').html(
                        "<h4>" + this.model.get('subject') + "</h4>" +
                        '<div class="widget-controls"><a href="#"><i class="fa fa-print"></i></a></div>'
                );
                $('#folder-stats').addClass('hide');
                $('#back-btn').removeClass('hide');
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },


            formatDate: function(dateInt){
                var date = new Date(dateInt),
                    now = new Date(),
                    todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                if (date.getTime() > todayStart){
                    return date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                }
                var daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                return ['Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()] + ' ' + date.getDate() + ' (' + daysAgo + ' days ago)';
            },


            replyEmail: function(){
                var body = "<br/><br/>" +
                        "<blockquote class='blockquote-sm'>" +
                        this.model.get("body") +
                        "</blockquote> <br/>",
                    newEmail = new Email({
                        body: body,
                        receiver: this.model.get("sender") ? this.model.get("sender") : this.model.get("senderMail"),
                        subject: "Re: " + this.model.get("subject")
                    });
                App.showComposeView(newEmail);
            }

        });

        var ComposeView = Backbone.View.extend({


            template: _.template($('#compose-view-template').html()),

            attributes: {
                id: 'compose-view',
                class: 'compose-view'
            },

            events: {
                "click #compose-save-button, #compose-send-button, #compose-discard-button": 'backToFolders'
            },

            render: function() {
                $('#widget-email-header').html(
                    '<h4>Compose <span class="fw-semi-bold">New</span></h4>'
                );
                $('#folder-stats').addClass('hide');
                $('#back-btn').removeClass('hide');
                this.$el.html(this.template(this.model.toJSON()));
                this._initViewComponents();
                return this;
            },

            backToFolders: function(){
                App.showEmailsView();
            },

            _initViewComponents: function(){
                this.$("textarea").wysihtml5({
                    html: true,
                    customTemplates: bs3Wysihtml5Templates,
                    stylesheets: []
                });
            }

        });

        var EmailListView = Backbone.View.extend({

            tagName: 'table',

            attributes: {
                id: 'folder-view',
                class: 'table table-striped table-emails table-hover'
            },


            template: _.template($('#folders-view-template').html()),

            events: {
                "change #toggle-all":  "toggleAll"
            },


            initialize: function() {
                this.currentFolderEmails = new EmailList();
                this.folders = Folders;

                this.listenTo(this.currentFolderEmails, 'reset', this.renderEmails);  //when displayed first time, and after
                this.listenTo(this.currentFolderEmails, 'all', this.renderFolderActions); //when something starred or selected display folder actions
                this.listenTo(this.currentFolderEmails, 'destroy', this.renderEmails); //when model deleted
                this.listenTo(this.folders, 'change', this.resetEmails); //when current folder changed
            },

            render: function() {
                $('#widget-email-header').html($('#email-list-view-header-template').html());
                $('#folder-stats').removeClass('hide');
                $('#back-btn').addClass('hide');
                /* manually attach events as we have few elements outside of main $el */
                $('#select-all').on('click', $.proxy(this.selectAll, this));
                $('#select-none').on('click', $.proxy(this.selectNone, this));
                $('#select-read').on('click', $.proxy(this.selectRead, this));
                $('#select-unread').on('click', $.proxy(this.selectUnread, this));
                $('#mark-as-read').on('click', $.proxy(this.markSelectedAsRead, this));
                $('#mark-as-unread').on('click', $.proxy(this.markSelectedAsUnread, this));
                $('#delete').on('click', $.proxy(this.deleteEmails, this));

                this.resetEmails();
                this.delegateEvents(this.events);
                return this;
            },

            renderFolderActions: function() {
                var selectedCount = this.currentFolderEmails.where({selected: true}).length,
                    allSelected = selectedCount == this.currentFolderEmails.length,
                    anySelected = selectedCount > 0;
                this.$toggleAllCheckbox = this.$('#toggle-all');
                this.$toggleAllCheckbox.prop('checked', allSelected);
            },


            addOne: function(email) {
                var view = new EmailView({model: email});
                this.$el.find("tbody").append(view.render().el);
            },

            renderEmails: function() {
                this.reset();
                if (this.currentFolderEmails.length){
                    this.currentFolderEmails.each(this.addOne, this);
                } else {
                    this.$el.find("tbody").append('<tr><td colspan="100">Nothing here yet</td></tr>')
                }
                var currentFolder = this.folders.where({current: true})[0],
                    unreadCount = this.currentFolderEmails.where({read: false}).length,
                    currentFolderTitle = 'Inbox';
                if (currentFolder){
                    currentFolderTitle = currentFolder.get("name");
                }
            },

            reset: function(){
                this.$el.html(this.template());
            },

            resetEmails: function(){
                var item = this.folders.where({current: true})[0],
                    folderId = 1;
                if (item){
                    folderId = item.get("id");
                }
                if (folderId == STARRED_FOLDER_ID){
                    this.currentFolderEmails.reset(Emails.where({
                        starred: true
                    }));
                } else {
                    this.currentFolderEmails.reset(Emails.where({
                        folderId: folderId
                    }));
                }
            },

            toggleAll: function(){
                var selectAll = this.$toggleAllCheckbox.prop('checked');
                this.currentFolderEmails.each(function (email) { email.save({'selected': selectAll}); });
            },

            selectAll: function(){
                this.$toggleAllCheckbox.prop('checked', true);
                this.toggleAll();
            },

            selectNone: function(){
                this.$toggleAllCheckbox.prop('checked', false);
                this.toggleAll();
            },

            selectRead: function(){
                this.selectNone();
                _(this.currentFolderEmails.where({read: true})).each(function (email) { email.save({'selected': true}); });
            },

            selectUnread: function(){
                this.selectNone();
                _(this.currentFolderEmails.where({read: false})).each(function (email) { email.save({'selected': true}); });
            },

            search: function(){
                var item = this.folders.where({current: true})[0],
                    folderId = 1;
                if (item){
                    folderId = item.get("id");
                }
                this.currentFolderEmails.reset(Emails.search($('#mailbox-search').val(), folderId));
            },

            markSelectedAsRead: function(){
                _(this.currentFolderEmails.where({selected: true})).each(function (email) { email.save({'read': true}); });
            },

            markSelectedAsUnread: function(){
                _(this.currentFolderEmails.where({selected: true})).each(function (email) { email.save({'read': false}); });
            },

            deleteEmails: function(){
                _(this.currentFolderEmails.where({selected: true})).each(function (email) { email.destroy(); });
            }

        });



        var EmailsView = new EmailListView();



        var AppView = Backbone.View.extend({


            el: $("#content"),
            $content: $("#mailbox-content"),

            events: {
                "keyup #mailbox-search": 'search',
                "click #compose-btn": 'handleComposeBtnClick',
                "click #back-btn": 'handleBackBtnClick'
            },

            initialize: function() {
                this.currentView = EmailsView;
                this.folders = Folders;

                this.listenTo(this.folders, 'reset', this.renderFolders);

                var view = this;
                this.folders.fetch({success: function(){
                    Emails.fetch({success: function(){
                        view.render();
                    }, reset: true});
                }, reset: true});
            },

            render: function(){
                this.$content.html(this.currentView.render().el);
            },

            setCurrentView: function(view){
                if (this.currentView !== EmailsView){
                    this.currentView.remove();
                }
                this.currentView = view;
                this.render();
            },

            renderFolders: function(){
                this.resetFoldersList();
                this.folders.each(this.addFolder, this);
            },

            resetFoldersList: function(){
                this.$("#folders-list").html('');
            },

            addFolder: function(folder){
                var view = new FolderView({model: folder});
                this.$("#folders-list").append(view.render().el);
            },

            search: function(){
                if (typeof this.currentView.search === 'function'){
                    this.currentView.search();
                }
            },

            showEmailsView: function(){
                if (this.currentView != EmailsView){
                    this.setCurrentView(EmailsView)
                }
            },

            handleComposeBtnClick: function(){
                this.showComposeView();
                return false;
            },

            handleBackBtnClick: function(){
                this.showEmailsView();
                return false;
            },

            showComposeView: function(model){
                model = model ? model : new Email({body: ''});
                this.setCurrentView(new ComposeView({model: model}));
            }

        });

        var App = new AppView;
    }

    /* this is only for demo. can be removed */
    function initMailboxAppDemo(){
        setTimeout(function(){
            $('#app-alert').removeClass('hide')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
                    $(this).removeClass('animated bounceInLeft');
                });
        }, 3000)
    }

    function pageLoad(e, event, toState, toParams, fromState, fromParams){
        if (toParams.page != 'inbox') return;
        setTimeout(function(){
            $('#wysiwyg').wysihtml5({
                html: true,
                customTemplates: bs3Wysihtml5Templates,
                stylesheets: []
            });

            initMailboxApp();

            initMailboxAppDemo()
        }, 0)
    }
//    pageLoad();
    $(window).on('sn:loaded', pageLoad);
//    SingApp.onPageLoad(pageLoad);
});