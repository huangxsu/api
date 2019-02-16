const Koa = require("koa");
const Router = require("koa-router");
const views = require('koa-views')
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const path = require('path')
const app = new Koa();
const router = new Router();

app.use(cors({
    credentials: true
}));
app.use(bodyParser());
app.use(views(path.join(__dirname, './src/view'), {
    extension: 'ejs'
}))

router.get('/test/example', async (ctx, next) => {
    ctx.cookies.set(
        'test-site-host',
        '',
        {
            domain: '.huangxsu.com',
            maxAge: 0,
            signed: false,
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: true  // 是否允许重写
        }
    )

    await ctx.render('example')
});

router.get('/test/ajax-cookie', async (ctx, next) => {
    const testCookie = ctx.cookies.get('test-site-host')
    if (testCookie && testCookie === ctx.host) {
        ctx.body = {
            message: 'ok',
            value: testCookie
        }
        ctx.status = 200;
    } else {
        ctx.body = {
            message: 'No cookie',
            value: testCookie
        }
        ctx.status = 500
    }
});

router.post('/test/ajax-cookie', async (ctx, next) => {
    const testCookie = ctx.cookies.get('test-site-host')
    if (testCookie && testCookie === ctx.host) {
        ctx.body = {
            message: 'ok',
            value: testCookie
        }
        ctx.status = 200;
    } else {
        ctx.body = {
            message: 'No cookie',
            value: testCookie
        }
        ctx.status = 500
    }
});

router.post('/test/post-request', async (ctx, next) => {
    await ctx.render('form', {
        request: {
            body: ctx.request.body,
            cookies: ctx.get('cookie')
        }
    })
});

router.get('/test/redirect-cookie', async (ctx, next) => {
    const {domain} = ctx.query
    ctx.cookies.set(
        'test-site-host',
        ctx.host,
        {
            domain: '.huangxsu.com',
            maxAge: 10 * 60 * 1000,
            signed: false,
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: true  // 是否允许重写
        }
    )
    ctx.redirect(`https://${domain}/test/redirect-dest`)
});

router.get('/test/redirect-dest', async (ctx, next) => {
    await ctx.render('cookie', {
        cookies: ctx.get('cookie')
    })
});

router.get('/test/cookie', async (ctx, next) => {
    ctx.cookies.set(
        'test-site-host',
        ctx.host,
        {
            maxAge: 10 * 60 * 1000,
            signed: false,
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: true  // 是否允许重写
        }
    )
    ctx.status = 200;
});
router.delete('/test/cookie', async (ctx, next) => {
    ctx.cookies.set(
        'test-site-host', '',
        {
            maxAge: 0,
            signed: false,
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: true  // 是否允许重写
        }
    )
    ctx.cookies.set(
        'test-bad-cookie',
        '',
        {
            maxAge: 0,
            signed: false,
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: true  // 是否允许重写
        }
    )
    ctx.status = 200;
})

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
