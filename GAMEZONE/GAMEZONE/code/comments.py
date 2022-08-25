#!/usr/bin/python
# -*- coding: utf-8 -*-
class Comments:
    def __init__(
            self,
            contenu,
            picture_comment,
            firstname_comment,
            lastname_comment,
            post_date,
    ):
        self.contenu = contenu
        self.picture_comment = picture_comment
        self.firstname_comment = firstname_comment
        self.lastname_comment = lastname_comment
        self.post_date = post_date
    def all_info(self):
        return {
            'contenu': self.contenu,
            'picture_comment': self.picture_comment,
            'firstname_comment': self.firstname_comment,
            'lastname_comment': self.lastname_comment,
            'post_date': self.post_date,
        }
    insert_schema = {
        'type': 'object',
        'required': ['contenu', 'firstname_comment', 'lastname_comment'
            , 'post_date'],
        'properties': {
            'contenu': {'type': 'string'},
            'picture_comment': {'type': 'string'},
            'firstname_comment': {'type': 'string'},
            'lastname_comment': {'type': 'string'},
            'post_date': {'type': 'string'},
        },
        'additionalProperties': False,
    }