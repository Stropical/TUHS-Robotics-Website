function init() {
    var e,
        i,
        t;
    for (window.requestAnimFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
            window.setTimeout(e, 1e3 / 60)
        }
    }(), resize(), mouse.x = canvas.clientWidth / 2, mouse.y = canvas.clientHeight / 2, e = 0; e < particleCount; e++) {
        var n = new Particle;
        particles.push(n),
        points.push([
            n.x * c,
            n.y * c
        ])
    }
    vertices = Delaunay.triangulate(points);
    var s = [];
    for (e = 0; e < vertices.length; e++) 
        3 == s.length && (triangles.push(s), s =[]),
        s.push(vertices[e]);
    
    for (e = 0; e < particles.length; e++) 
        for (i = 0; i < triangles.length; i++) 
            t = triangles[i].indexOf(e),
            t !== -1 && triangles[i].forEach(function (i, t, n) {
                i !== e && particles[e].neighbors.indexOf(i) == -1 && particles[e].neighbors.push(i)
            });
        
    
    if (renderFlares) 
        for (e = 0; e < flareCount; e++) 
            flares.push(new Flare);
        
    
    "ontouchstart" in document.documentElement && window.DeviceOrientationEvent ? (console.log("Using device orientation"), window.addEventListener("deviceorientation", function (e) {
        mouse.x = canvas.clientWidth / 2 - e.gamma / 90 * (canvas.clientWidth / 2) * 2,
        mouse.y = canvas.clientHeight / 2 - e.beta / 90 * (canvas.clientHeight / 2) * 2
    }, !0)) : (console.log("Using mouse movement"), document.body.addEventListener("mousemove", function (e) {
        mouse.x = e.clientX,
        mouse.y = e.clientY
    })),
    randomMotion,
    function o() {
        requestAnimFrame(o),
        resize(),
        render()
    }()
}
function render() {
    if (randomMotion && (n++, n >= noiseLength && (n = 0), nPos = noisePoint(n)), context.clearRect(0, 0, canvas.width, canvas.height), blurSize > 0 && (context.shadowBlur = blurSize, context.shadowColor = color), renderParticles) 
        for (var e = 0; e < particleCount; e++) 
            particles[e].render();
        
    
    if (renderMesh) {
        context.beginPath();
        for (var i = 0; i < vertices.length - 1; i++) 
            if ((i + 1) % 3 !== 0) {
                var t = particles[vertices[i]],
                    s = particles[vertices[i + 1]],
                    o = position(t.x, t.y, t.z),
                    a = position(s.x, s.y, s.z);
                context.moveTo(o.x, o.y),
                context.lineTo(a.x, a.y)
            }
        
        context.strokeStyle = color,
        context.lineWidth = lineWidth,
        context.stroke(),
        context.closePath()
    }
    if (renderLinks) {
        if (random(0, linkChance) == linkChance) {
            var r = random(linkLengthMin, linkLengthMax),
                l = random(0, particles.length - 1);
            startLink(l, r)
        }
        for (var c = links.length - 1; c >= 0; c--) 
            links[c] && ! links[c].finished ? links[c].render() : delete links[c]
        
    }
    if (renderFlares) 
        for (var h = 0; h < flareCount; h++) 
            flares[h].render()
        
    
}
function resize() {
    canvas.width = window.innerWidth * (window.devicePixelRatio || 1),
    canvas.height = canvas.width * (canvas.clientHeight / canvas.clientWidth)
}
function startLink(e, i) {
    links.push(new Link(e, i))
}
function noisePoint(e) {
    var i = nAngle * e,
        t = Math.cos(i),
        n = Math.sin(i),
        s = nRad;
    return {
        x: s * t,
        y: s * n
    }
}
function position(e, i, t) {
    return {
        x: e * canvas.width + (canvas.width / 2 - mouse.x + (nPos.x - .5) * noiseStrength) * t * motion,
        y: i * canvas.height + (canvas.height / 2 - mouse.y + (nPos.y - .5) * noiseStrength) * t * motion
    }
}
function sizeRatio() {
    return canvas.width >= canvas.height ? canvas.width : canvas.height
}
function random(e, i, t) {
    return t ? Math.random() * (i - e) + e : Math.floor(Math.random() * (i - e + 1)) + e
}
$(document).ready(function () {
    $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function (e) {
        if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
            var i = $(this.hash);
            i = i.length ? i : $("[name=" + this.hash.slice(1) + "]"),
            i.length && (e.preventDefault(), $("html, body").animate({
                scrollTop: i.offset().top
            }, 1e3, "easeInOutQuart", function () {
                var e = $(i);
                return e.focus(),
                ! e.is(":focus") && (e.attr("tabindex", "-1"), void e.focus())
            }))
        }
    });
    var e = $(".js-fixed-navigation"),
        i = 0,
        t = function () {
            var t = $(".hero").height(),
                n = $(window).scrollTop();
            n > i ? e.removeClass("is-shown") : $(window).scrollTop() > t ? e.addClass("is-shown") : e.removeClass("is-shown"),
            i = n
        };
    $(window).on("scroll", t)
}),
$(window).on("load", function () {
    setTimeout(function () {
        var e = new WOW;
        e.init(),
        $(".preloader").addClass("is-hidden")
    }, 1e3),
    setTimeout(function () {
        $(".preloader").addClass("d-none")
    }, 1750)
}),
$(document).ready(function () {
    var e = $(".js-mobile-menu-button"),
        i = $(".js-mobile-menu"),
        t = $(".js-mobile-menu .item a"),
        n = null,
        s = function () {
            e.toggleClass("is-open"),
            $(window).scrollTop(0),
            i.hasClass("is-shown") ? ($("html, body").removeClass("overflow-hidden"), i.removeClass("is-shown"), n = setTimeout(function () {
                i.addClass("d-none")
            }, 800)) : (clearTimeout(n), $("html, body").addClass("overflow-hidden"), i.removeClass("d-none"), setTimeout(function () {
                i.addClass("is-shown")
            }, 100))
        };
    e.on("click", s),
    t.on("click", s)
}),
$(function () {
    $(".position-aware").on("mouseenter", function (e) {
        var i = $(this).offset(),
            t = e.pageX - i.left,
            n = e.pageY - i.top;
        $(this).find(".circle").css({top: n, left: t})
    }).on("mouseout", function (e) {
        var i = $(this).offset(),
            t = e.pageX - i.left,
            n = e.pageY - i.top;
        $(this).find(".circle").css({top: n, left: t})
    })
}),
$(document).ready(function () {
    $(".js-resources-slider").slick({
        infinite: !0,
        centerMode: !0,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: !0,
        arrows: !1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerMode: !1
                }
            }
        ]
    }),
    $(".js-resources-slider-right").on("click", function () {
        $(".js-resources-slider").slick("slickNext")
    }),
    $(".js-resources-slider-left").on("click", function () {
        $(".js-resources-slider").slick("slickPrev")
    })
}),
$(window).on("load", function () {
    var e = function (e) {
        for (var i = document.getElementsByClassName(e), t = 0; t < i.length; t++) 
            for (var n = i[t], s = n.innerHTML.split(" "); n.scrollHeight > n.offsetHeight;) 
                s.pop(),
                n.innerHTML = s.join(" ") + "..."
            
        
    };
    e("ellipsis-text")
}),
$(document).ready(function () {
    var e,
        i = $(".js-slider-control-left"),
        t = $(".js-slider-control-right"),
        n = $(".js-team-slider"),
        s = $(".js-pager-current"),
        o = $(".js-photos-container"),
        a = $(".js-slider-name"),
        r = $(".js-slider-info"),
        l = $(".js-slider-social"),
        c = !1,
        h = function () {
            var e = parseInt(n.attr("data-slide-index")),
                i = (o.width(), 1);
            o.animate({
                scrollLeft: 0
            }, 1e3, "easeInOutQuart"),
            a.children().eq(e - 1).addClass("is-out"),
            setTimeout(function () {
                a.children().removeClass("is-shown is-in is-out"),
                a.children().eq(i - 1).addClass("is-shown")
            }, 500),
            setTimeout(function () {
                a.children().eq(i - 1).addClass("is-in")
            }, 600),
            r.children().eq(e - 1).removeClass("is-in"),
            setTimeout(function () {
                r.children().removeClass("is-shown is-in"),
                r.children().eq(i - 1).addClass("is-shown")
            }, 500),
            setTimeout(function () {
                r.children().eq(i - 1).addClass("is-in")
            }, 600),
            l.children().eq(e - 1).removeClass("is-in"),
            setTimeout(function () {
                l.children().removeClass("is-shown is-in"),
                l.children().eq(i - 1).addClass("is-shown")
            }, 500),
            setTimeout(function () {
                l.children().eq(i - 1).addClass("is-in")
            }, 600),
            s.text(i),
            n.attr("data-slide-index", i)
        },
        d = function () {
            var e = parseInt(n.attr("data-slide-index")),
                i = o.width(),
                t = 6;
            o.animate({
                scrollLeft: i * (t - 1)
            }, 1e3, "easeInOutQuart"),
            a.children().eq(e - 1).addClass("is-out"),
            setTimeout(function () {
                a.children().removeClass("is-shown is-in is-out"),
                a.children().eq(t - 1).addClass("is-shown")
            }, 500),
            setTimeout(function () {
                a.children().eq(t - 1).addClass("is-in")
            }, 600),
            r.children().eq(e - 1).removeClass("is-in"),
            setTimeout(function () {
                r.children().removeClass("is-shown is-in"),
                r.children().eq(t - 1).addClass("is-shown")
            }, 500),
            setTimeout(function () {
                r.children().eq(t - 1).addClass("is-in")
            }, 600),
            l.children().eq(e - 1).removeClass("is-in"),
            setTimeout(function () {
                l.children().removeClass("is-shown is-in"),
                l.children().eq(t - 1).addClass("is-shown")
            }, 500),
            setTimeout(function () {
                l.children().eq(t - 1).addClass("is-in")
            }, 600),
            s.text(t),
            n.attr("data-slide-index", t)
        },
        u = function () {
            var e = parseInt(n.attr("data-slide-index")),
                i = o.width();
            if (e > 1) {
                var t = e - 1;
                o.animate({
                    scrollLeft: i * (t - 1)
                }, 1e3, "easeInOutQuart"),
                a.children().eq(e - 1).addClass("is-out"),
                setTimeout(function () {
                    a.children().removeClass("is-shown is-in is-out"),
                    a.children().eq(t - 1).addClass("is-shown")
                }, 500),
                setTimeout(function () {
                    a.children().eq(t - 1).addClass("is-in")
                }, 600),
                r.children().eq(e - 1).removeClass("is-in"),
                setTimeout(function () {
                    r.children().removeClass("is-shown is-in"),
                    r.children().eq(t - 1).addClass("is-shown")
                }, 500),
                setTimeout(function () {
                    r.children().eq(t - 1).addClass("is-in")
                }, 600),
                l.children().eq(e - 1).removeClass("is-in"),
                setTimeout(function () {
                    l.children().removeClass("is-shown is-in"),
                    l.children().eq(t - 1).addClass("is-shown")
                }, 500),
                setTimeout(function () {
                    l.children().eq(t - 1).addClass("is-in")
                }, 600),
                s.text(t),
                n.attr("data-slide-index", t)
            } else 
                d()
            
        },
        f = function () {
            var e = parseInt(n.attr("data-slide-index")),
                i = o.width(),
                t = o.children().length;
            if (e < t) {
                var c = e + 1;
                o.animate({
                    scrollLeft: i * (c - 1)
                }, 1e3, "easeInOutQuart"),
                a.children().eq(e - 1).addClass("is-out"),
                setTimeout(function () {
                    a.children().removeClass("is-shown is-in is-out"),
                    a.children().eq(c - 1).addClass("is-shown")
                }, 500),
                setTimeout(function () {
                    a.children().eq(c - 1).addClass("is-in")
                }, 600),
                r.children().eq(e - 1).removeClass("is-in"),
                setTimeout(function () {
                    r.children().removeClass("is-shown is-in"),
                    r.children().eq(c - 1).addClass("is-shown")
                }, 500),
                setTimeout(function () {
                    r.children().eq(c - 1).addClass("is-in")
                }, 600),
                l.children().eq(e - 1).removeClass("is-in"),
                setTimeout(function () {
                    l.children().removeClass("is-shown is-in"),
                    l.children().eq(c - 1).addClass("is-shown")
                }, 500),
                setTimeout(function () {
                    l.children().eq(c - 1).addClass("is-in")
                }, 600),
                s.text(c),
                n.attr("data-slide-index", c)
            } else 
                h()
            
        },
        m = function () {
            e = setInterval(function () {
                f()
            }, 5e3)
        };
    i.on("click", u),
    t.on("click", f),
    $(window).on("scroll", function () {
        $(window).scrollTop() > $(".about-us--slider").offset().top && 0 == c && (m(), c =! 0)
    }),
    i.on("click", function () {
        clearInterval(e)
    }),
    t.on("click", function () {
        clearInterval(e)
    })
});
var particleCount = 40,
    flareCount = 10,
    motion = .05,
    tilt = .05,
    color = "#f6f6f6",
    particleSizeBase = 1,
    particleSizeMultiplier = .5,
    flareSizeBase = 100,
    flareSizeMultiplier = 100,
    lineWidth = 1,
    linkChance = 35,
    linkLengthMin = 5,
    linkLengthMax = 7,
    linkOpacity = .5;
linkFade = 90,
linkSpeed = 1,
glareAngle = -60,
glareOpacityMultiplier = .05,
renderParticles = !0,
renderParticleGlare = !0,
renderFlares = !0,
renderLinks = !0,
renderMesh = !1,
flicker = !0,
flickerSmoothing = 15,
blurSize = 0,
orbitTilt = !0,
randomMotion = !0,
noiseLength = 1e3,
noiseStrength = 1;
var canvas = document.getElementById("stars"),
    context = canvas.getContext("2d"),
    mouse = {
        x: 0,
        y: 0
    },
    m = {},
    r = 0,
    c = 1e3,
    n = 0,
    nAngle = 2 * Math.PI / noiseLength,
    nRad = 100,
    nScale = .5,
    nPos = {
        x: 0,
        y: 0
    },
    points = [],
    vertices = [],
    triangles = [],
    links = [],
    particles = [],
    flares = [],
    Particle = function () {
        this.x = random(-.1, 1.1, !0),
        this.y = random(-.1, 1.1, !0),
        this.z = random(0, 4),
        this.color = color,
        this.opacity = random(.1, 1, !0),
        this.flicker = 0,
        this.neighbors = []
    };
Particle.prototype.render = function () {
    var e = position(this.x, this.y, this.z),
        i = (this.z * particleSizeMultiplier + particleSizeBase) * (sizeRatio() / 1e3),
        t = this.opacity;
    if (flicker) {
        var n = random(-.5, .5, !0);
        this.flicker += (n - this.flicker) / flickerSmoothing,
        this.flicker > .5 && (this.flicker = .5),
        this.flicker<-.5&&(this.flicker=-.5), t+=this.flicker, t> 1 && (t = 1),
        t < 0 && (t = 0)
    }
    context.fillStyle = this.color,
    context.globalAlpha = t,
    context.beginPath(),
    context.arc(e.x, e.y, i, 0, 2 * Math.PI, !1),
    context.fill(),
    context.closePath(),
    renderParticleGlare && (context.globalAlpha = t * glareOpacityMultiplier, context.ellipse(e.x, e.y, 100 * i, i, (glareAngle -(nPos.x - .5) * noiseStrength * motion) * (Math.PI / 180), 0, 2 * Math.PI, !1), context.fill(), context.closePath()),
    context.globalAlpha = 1
};
var Flare = function () {
    this.x = random(-.25, 1.25, !0),
    this.y = random(-.25, 1.25, !0),
    this.z = random(0, 2),
    this.color = color,
    this.opacity = random(.001, .01, !0)
};
Flare.prototype.render = function () {
    var e = position(this.x, this.y, this.z),
        i = (this.z * flareSizeMultiplier + flareSizeBase) * (sizeRatio() / 1e3);
    context.beginPath(),
    context.globalAlpha = this.opacity,
    context.arc(e.x, e.y, i, 0, 2 * Math.PI, !1),
    context.fillStyle = this.color,
    context.fill(),
    context.closePath(),
    context.globalAlpha = 1
};
var Link = function (e, i) {
    this.length = i,
    this.verts = [e],
    this.stage = 0,
    this.linked = [e],
    this.distances = [],
    this.traveled = 0,
    this.fade = 0,
    this.finished = !1
};
Link.prototype.render = function () {
    var e,
        i,
        t,
        n;
    switch (this.stage) {
        case 0:
            var s = particles[this.verts[this.verts.length - 1]];
            if (s && s.neighbors && s.neighbors.length > 0) {
                var o = s.neighbors[random(0, s.neighbors.length - 1)];
                this.verts.indexOf(o) == -1 && this.verts.push(o)
            } else 
                this.stage = 3,
                this.finished = !0;
            
            if (this.verts.length >= this.length) {
                for (e = 0; e < this.verts.length - 1; e++) {
                    var a = particles[this.verts[e]],
                        r = particles[this.verts[e + 1]],
                        l = a.x - r.x,
                        c = a.y - r.y,
                        h = Math.sqrt(l * l + c * c);
                    this.distances.push(h)
                }
                this.stage = 1
            }
            break;
        case 1:
            if (this.distances.length > 0) {
                for (n =[], e = 0; e < this.linked.length; e++) 
                    i = particles[this.linked[e]],
                    t = position(i.x, i.y, i.z),
                    n.push([t.x, t.y]);
                
                var d = 1e-5 * linkSpeed * canvas.width;
                this.traveled += d;
                var u = this.distances[this.linked.length - 1];
                if (this.traveled >= u) 
                    this.traveled = 0,
                    this.linked.push(this.verts[this.linked.length]),
                    i = particles[this.linked[this.linked.length - 1]],
                    t = position(i.x, i.y, i.z),
                    n.push([t.x, t.y]),
                    this.linked.length >= this.verts.length && (this.stage = 2);
                 else {
                    var f = particles[this.linked[this.linked.length - 1]],
                        m = particles[this.verts[this.linked.length]],
                        v = u - this.traveled,
                        p = (this.traveled * m.x + v * f.x) / u,
                        g = (this.traveled * m.y + v * f.y) / u,
                        x = (this.traveled * m.z + v * f.z) / u;
                    t = position(p, g, x),
                    n.push([t.x, t.y])
                }
                this.drawLine(n)
            } else 
                this.stage = 3,
                this.finished = !0;
            
            break;
        case 2:
            if (this.verts.length > 1) 
                if (this.fade<linkFade){this.fade++, n=[];var w=(1-this.fade/linkFade)*linkOpacity;for(e=0;e<this.verts.length;e++)i=particles[this.verts[e]], t=position(i.x, i.y, i.z), n.push([t.x, t.y]);this.drawLine(n, w)}else this.stage=3, this.finished=!0;else this.stage=3, this.finished=!0;break;case 3:default:this.finished=!0}}, Link.prototype.drawLine=function(e, i){var t=["#1FBDCB", "#70C87B", "#F3C237"], n=t[Math.floor(3*Math.random())];if("number"!=typeof i&&(i=linkOpacity), e.length>1&&i> 0) {
                    context.globalAlpha = i,
                    context.beginPath();
                    for (var s = 0; s < e.length - 1; s++) 
                        context.moveTo(e[s][0], e[s][1]),
                        context.lineTo(e[s + 1][0], e[s + 1][1]);
                    
                    context.strokeStyle = n,
                    context.lineWidth = lineWidth,
                    context.stroke(),
                    context.closePath(),
                    context.globalAlpha = 1
                }
            
    },
    canvas && init();
