<template>
    <div>
        <h2 id="page-heading">
            <span v-text="$t('gatewayApp.blogPost.home.title')" id="post-heading">Posts</span>
            <router-link :to="{name: 'PostCreate'}" tag="button" id="jh-create-entity" class="btn btn-primary float-right jh-create-entity create-post">
                <font-awesome-icon icon="plus"></font-awesome-icon>
                <span  v-text="$t('gatewayApp.blogPost.home.createLabel')">
                    Create a new Post
                </span>
            </router-link>
        </h2>
        <b-alert :show="dismissCountDown"
            dismissible
            :variant="alertType"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged">
            {{alertMessage}}
        </b-alert>
        <br/>
        <div class="alert alert-warning" v-if="!isFetching && posts && posts.length === 0">
            <span v-text="$t('gatewayApp.blogPost.home.notFound')">No posts found</span>
        </div>
        <div class="table-responsive" v-if="posts && posts.length > 0">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th v-on:click="changeOrder('id')"><span v-text="$t('global.field.id')">ID</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('title')"><span v-text="$t('gatewayApp.blogPost.title')">Title</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('content')"><span v-text="$t('gatewayApp.blogPost.content')">Content</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('date')"><span v-text="$t('gatewayApp.blogPost.date')">Date</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('blog.name')"><span v-text="$t('gatewayApp.blogPost.blog')">Blog</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="post in posts"
                    :key="post.id">
                    <td>
                        <router-link :to="{name: 'PostView', params: {postId: post.id}}">{{post.id}}</router-link>
                    </td>
                    <td>{{post.title}}</td>
                    <td>{{post.content}}</td>
                    <td v-if="post.date"> {{$d(Date.parse(post.date), 'short') }}</td>
                    <td>
                        <div v-if="post.blog">
                            <router-link :to="{name: 'BlogView', params: {blogId: post.blog.id}}">{{post.blog.name}}</router-link>
                        </div>
                    </td>
                    <td class="text-right">
                        <div class="btn-group">
                            <router-link :to="{name: 'PostView', params: {postId: post.id}}" tag="button" class="btn btn-info btn-sm details">
                                <font-awesome-icon icon="eye"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                            </router-link>
                            <router-link :to="{name: 'PostEdit', params: {postId: post.id}}"  tag="button" class="btn btn-primary btn-sm edit">
                                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                            </router-link>
                            <b-button v-on:click="prepareRemove(post)"
                                   variant="danger"
                                   class="btn btn-sm"
                                   v-b-modal.removeEntity>
                                <font-awesome-icon icon="times"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                            </b-button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <b-modal ref="removeEntity" id="removeEntity" >
            <span slot="modal-title"><span id="gatewayApp.blogPost.delete.question" v-text="$t('entity.delete.title')">Confirm delete operation</span></span>
            <div class="modal-body">
                <p id="jhi-delete-post-heading" v-bind:title="$t('gatewayApp.blogPost.delete.question')">Are you sure you want to delete this Post?</p>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
                <button type="button" class="btn btn-primary" id="jhi-confirm-delete-post" v-text="$t('entity.action.delete')" v-on:click="removePost()">Delete</button>
            </div>
        </b-modal>
    </div>
</template>

<script lang="ts" src="./post.component.ts">
</script>
