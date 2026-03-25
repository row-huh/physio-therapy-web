(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.4.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.1.1_@types+react@19.2.7_react@19.2.0/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$2$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.86.2/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$2$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.86.2/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://dfsutzuegywynbzmzvwz.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "sb_publishable_O8heNzmt_5skljH2Rew8YA_kpoLZnke");
const createClient = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$2$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAllExercises",
    ()=>clearAllExercises,
    "deleteExercise",
    ()=>deleteExercise,
    "getAllExercises",
    ()=>getAllExercises,
    "getExercise",
    ()=>getExercise,
    "saveExerciseVideo",
    ()=>saveExerciseVideo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/supabase/client.ts [app-client] (ecmascript)");
;
const STORAGE_KEY = "exercise-videos";
const SUPABASE_BUCKET = "reference-videos";
function getVideos() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (e) {
        console.error("Error loading exercise videos:", e);
        return [];
    }
}
function saveVideos(videos) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
        console.log(`✅ Saved ${videos.length} exercise videos metadata to localStorage`);
    } catch (e) {
        console.error("❌ Error saving exercise videos metadata:", e);
    }
}
async function saveExerciseVideo(name, videoBlob, exerciseType = "custom", learnedTemplate) {
    const id = Date.now().toString();
    console.log(`📹 Saving exercise video: ${name} (${exerciseType})`);
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
        const fileName = `${id}_${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm`;
        const filePath = `${exerciseType}/${fileName}`;
        console.log(`Uploading video to Supabase: ${filePath}`);
        const { data: uploadData, error: uploadError } = await supabase.storage.from(SUPABASE_BUCKET).upload(filePath, videoBlob, {
            contentType: videoBlob.type || 'video/webm',
            cacheControl: '3600',
            upsert: false
        });
        if (uploadError) {
            console.error("❌ Supabase upload error:", uploadError);
            throw new Error(`Failed to upload video: ${uploadError.message}`);
        }
        console.log(`Video uploaded to Supabase:`, uploadData);
        const { data: urlData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);
        if (!urlData?.publicUrl) {
            throw new Error("Failed to get public URL for uploaded video");
        }
        console.log(`Public URL:`, urlData.publicUrl);
        const video = {
            id,
            name,
            type: exerciseType,
            videoUrl: urlData.publicUrl,
            timestamp: Date.now(),
            storedInSupabase: true,
            learnedTemplate
        };
        const videos = getVideos();
        videos.push(video);
        saveVideos(videos);
        console.log(`Exercise video saved with ID: ${id}`);
        return video;
    } catch (err) {
        console.error("Error in saveExerciseVideo:", err);
        throw err;
    }
}
function getAllExercises() {
    const videos = getVideos();
    console.log(`Retrieved ${videos.length} exercise videos from storage`);
    return videos;
}
function getExercise(id) {
    const video = getVideos().find((v)=>v.id === id);
    if (video) {
        console.log(`Found exercise video: ${video.name} (${video.type})`);
    } else {
        console.warn(`Exercise video not found: ${id}`);
    }
    return video;
}
async function deleteExercise(id) {
    const videos = getVideos();
    const videoToDelete = videos.find((v)=>v.id === id);
    if (!videoToDelete) {
        return false;
    }
    if (videoToDelete.storedInSupabase) {
        try {
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            // Extract file path from URL
            const url = new URL(videoToDelete.videoUrl);
            const pathParts = url.pathname.split('/storage/v1/object/public/' + SUPABASE_BUCKET + '/');
            if (pathParts.length > 1) {
                const filePath = pathParts[1];
                console.log(`🗑️ Deleting from Supabase: ${filePath}`);
                const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([
                    filePath
                ]);
                if (error) {
                    console.error("❌ Error deleting from Supabase:", error);
                } else {
                    console.log("Deleted from Supabase");
                }
            }
        } catch (err) {
            console.error("Error deleting from Supabase:", err);
        }
    }
    const filtered = videos.filter((v)=>v.id !== id);
    saveVideos(filtered);
    console.log(`Deleted exercise video: ${id}`);
    return true;
}
function clearAllExercises() {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Cleared all exercise videos");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/pose-analyzer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeVideoForPose",
    ()=>analyzeVideoForPose
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mediapipe+tasks-vision@0.10.22-rc.20250304/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs [app-client] (ecmascript)");
;
/**
 * One Euro Filter for temporal smoothing of landmarks
 * Reduces jitter while maintaining responsiveness to real movement
 */ class OneEuroFilter {
    min_cutoff;
    beta;
    d_cutoff;
    x_prev;
    dx_prev;
    t_prev;
    constructor(min_cutoff = 1.0, beta = 0.007, d_cutoff = 1.0){
        this.min_cutoff = min_cutoff;
        this.beta = beta;
        this.d_cutoff = d_cutoff;
        this.x_prev = 0;
        this.dx_prev = 0;
        this.t_prev = 0;
    }
    smoothingFactor(t_e, cutoff) {
        const r = 2 * Math.PI * cutoff * t_e;
        return r / (r + 1);
    }
    exponentialSmoothing(a, x, x_prev) {
        return a * x + (1 - a) * x_prev;
    }
    filter(x, t) {
        const t_e = this.t_prev === 0 ? 0 : t - this.t_prev;
        if (t_e === 0) {
            return x;
        }
        // Estimate velocity
        const dx = (x - this.x_prev) / t_e;
        const edx = this.exponentialSmoothing(this.smoothingFactor(t_e, this.d_cutoff), dx, this.dx_prev);
        // Adaptive cutoff based on velocity
        const cutoff = this.min_cutoff + this.beta * Math.abs(edx);
        // Smooth the signal
        const x_filtered = this.exponentialSmoothing(this.smoothingFactor(t_e, cutoff), x, this.x_prev);
        // Store for next iteration
        this.x_prev = x_filtered;
        this.dx_prev = edx;
        this.t_prev = t;
        return x_filtered;
    }
}
/**
 * Landmark smoother using One Euro Filters
 */ class LandmarkSmoother {
    min_cutoff;
    beta;
    filters;
    constructor(min_cutoff = 1.0, beta = 0.007){
        this.min_cutoff = min_cutoff;
        this.beta = beta;
        this.filters = new Map();
    }
    smoothLandmarks(landmarks, timestamp) {
        return landmarks.map((landmark, index)=>{
            const key = `landmark_${index}`;
            if (!this.filters.has(key)) {
                this.filters.set(key, {
                    x: new OneEuroFilter(this.min_cutoff, this.beta),
                    y: new OneEuroFilter(this.min_cutoff, this.beta),
                    z: new OneEuroFilter(this.min_cutoff, this.beta)
                });
            }
            const filter = this.filters.get(key);
            return {
                x: filter.x.filter(landmark.x, timestamp),
                y: filter.y.filter(landmark.y, timestamp),
                z: filter.z ? filter.z.filter(landmark.z || 0, timestamp) : landmark.z,
                visibility: landmark.visibility
            };
        });
    }
    reset() {
        this.filters.clear();
    }
}
// MediaPipe Pose landmark indices
const POSE_LANDMARKS = {
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28,
    LEFT_HEEL: 29,
    RIGHT_HEEL: 30,
    LEFT_FOOT_INDEX: 31,
    RIGHT_FOOT_INDEX: 32
};
/**
 * Calculate angle between three points (in degrees)
 * This is the interior angle at point b, formed by vectors b->a and b->c
 * @param a First point [x, y]
 * @param b Middle point (vertex) [x, y]
 * @param c Third point [x, y]
 * @returns Angle in degrees (0-180)
 */ function calculateAngle(a, b, c) {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
        angle = 360.0 - angle;
    }
    return angle;
}
/**
 * Calculate the angle of a line segment relative to the vertical (0° = straight down)
 * @param start Starting point [x, y]
 * @param end Ending point [x, y]
 * @returns Angle in degrees (0-180)
 */ function calculateSegmentAngleFromVertical(start, end) {
    // Vector from start to end
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    // Angle from vertical (negative Y axis, since Y increases downward in screen coords)
    // atan2(dx, -dy) gives angle from vertical
    const radians = Math.atan2(dx, dy);
    const degrees = Math.abs(radians * 180.0 / Math.PI);
    return degrees;
}
/**
 * Calculate the angle of a line segment relative to the horizontal (0° = horizontal)
 * @param start Starting point [x, y]
 * @param end Ending point [x, y]
 * @returns Angle in degrees (0-90)
 */ function calculateSegmentAngleFromHorizontal(start, end) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    // Angle from horizontal
    const radians = Math.atan2(Math.abs(dy), Math.abs(dx));
    const degrees = radians * 180.0 / Math.PI;
    return degrees;
}
async function analyzeVideoForPose(videoBlob, anglesOfInterest, exerciseInfo) {
    console.log("Starting pose analysis...");
    console.log("Video blob size:", videoBlob.size, "bytes");
    console.log("Video blob type:", videoBlob.type);
    if (anglesOfInterest) {
        console.log("Tracking angles:", anglesOfInterest.join(", "));
    } else {
        console.log("Tracking all angles");
    }
    try {
        // Initialize MediaPipe
        console.log("Initializing MediaPipe...");
        const vision = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilesetResolver"].forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm");
        console.log("Creating PoseLandmarker...");
        const poseLandmarker = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PoseLandmarker"].createFromOptions(vision, {
            baseOptions: {
                // Use full model for better stability (not lite)
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
            // Output segmentation mask helps with tracking stability
            outputSegmentationMasks: false
        });
        console.log("PoseLandmarker created successfully");
        // Create video element from blob
        const videoUrl = URL.createObjectURL(videoBlob);
        const video = document.createElement("video");
        video.src = videoUrl;
        video.muted = true;
        video.crossOrigin = "anonymous";
        console.log("Waiting for video to load...");
        await new Promise((resolve, reject)=>{
            video.onloadedmetadata = ()=>{
                console.log("Video metadata loaded");
                console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight);
                console.log("Video duration:", video.duration, "seconds");
                resolve(null);
            };
            video.onerror = (e)=>{
                console.error("Video load error:", e);
                reject(new Error("Failed to load video"));
            };
            setTimeout(()=>reject(new Error("Video load timeout")), 10000);
        });
        const jointAngles = [];
        const fps = 30 // Process at 30 FPS for better temporal consistency
        ;
        const frameInterval = 1000 / fps;
        // Initialize landmark smoother with tuned parameters
        // min_cutoff: lower = more smoothing, higher = more responsive
        // beta: higher = more responsive to velocity changes
        const landmarkSmoother = new LandmarkSmoother(1.0, 0.007);
        console.log(`Processing video at ${fps} FPS with One Euro Filter smoothing`);
        // Process video frames
        let frameCount = 0;
        for(let time = 0; time < video.duration * 1000; time += frameInterval){
            video.currentTime = time / 1000;
            await new Promise((resolve)=>{
                video.onseeked = resolve;
            });
            // Detect pose
            const timestamp = video.currentTime * 1000;
            const results = poseLandmarker.detectForVideo(video, timestamp);
            if (results.landmarks && results.landmarks.length > 0) {
                // Apply temporal smoothing to raw landmarks
                const rawLandmarks = results.landmarks[0];
                const smoothedLandmarks = landmarkSmoother.smoothLandmarks(rawLandmarks, timestamp);
                // Calculate angles from smoothed landmarks
                const angles = calculateJointAngles(smoothedLandmarks, anglesOfInterest);
                angles.forEach((angleData)=>{
                    jointAngles.push({
                        ...angleData,
                        timestamp: video.currentTime
                    });
                });
                frameCount++;
            }
            if (frameCount % 30 === 0) {
                console.log(`Processed ${frameCount} frames at ${video.currentTime.toFixed(2)}s`);
            }
        }
        console.log(`Total frames processed: ${frameCount}`);
        console.log(`Total joint angles detected: ${jointAngles.length}`);
        // Analyze movements
        const movements = detectMovements(jointAngles);
        console.log(`Detected ${movements.length} movement sequences`);
        // Generate summary
        const summary = generateSummary(movements);
        // Learn exercise states if exercise info provided
        let learnedTemplate;
        if (exerciseInfo && anglesOfInterest && anglesOfInterest.length > 0) {
            console.log("🧠 Learning exercise states from video...");
            const { learnExerciseStates } = await __turbopack_context__.A("[project]/lib/exercise-state-learner.ts [app-client] (ecmascript, async loader)");
            learnedTemplate = learnExerciseStates(jointAngles, exerciseInfo.name, exerciseInfo.type, anglesOfInterest);
            console.log(`✅ Learned ${learnedTemplate.states.length} states`);
            console.log(`📊 Template confidence: ${learnedTemplate.metadata.confidence}%`);
        }
        // Cleanup
        URL.revokeObjectURL(videoUrl);
        poseLandmarker.close();
        return {
            jointAngles,
            movements,
            summary,
            learnedTemplate
        };
    } catch (error) {
        console.error("Error in analyzeVideoForPose:", error);
        throw error;
    }
}
/**
 * Calculate angles for key joints from landmarks
 * @param landmarks The pose landmarks
 * @param anglesOfInterest Optional filter for specific angles
 */ function calculateJointAngles(landmarks, anglesOfInterest) {
    const angles = [];
    // Helper to get landmark coordinates
    const getLandmark = (index)=>[
            landmarks[index].x,
            landmarks[index].y
        ];
    // Helper to check if we should track this angle
    const shouldTrack = (angleName)=>{
        if (!anglesOfInterest) return true;
        return anglesOfInterest.includes(angleName);
    };
    // === JOINT ANGLES (3-point angles) ===
    // These measure the interior angle at a joint, useful for bends/flexion
    // Left elbow angle (shoulder-elbow-wrist)
    if (shouldTrack("left_elbow")) {
        try {
            const leftElbowAngle = calculateAngle(getLandmark(POSE_LANDMARKS.LEFT_SHOULDER), getLandmark(POSE_LANDMARKS.LEFT_ELBOW), getLandmark(POSE_LANDMARKS.LEFT_WRIST));
            angles.push({
                joint: "left_elbow",
                angle: leftElbowAngle
            });
        } catch (e) {
            console.warn("Could not calculate left elbow angle");
        }
    }
    // Right elbow angle (shoulder-elbow-wrist)
    if (shouldTrack("right_elbow")) {
        try {
            const rightElbowAngle = calculateAngle(getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER), getLandmark(POSE_LANDMARKS.RIGHT_ELBOW), getLandmark(POSE_LANDMARKS.RIGHT_WRIST));
            angles.push({
                joint: "right_elbow",
                angle: rightElbowAngle
            });
        } catch (e) {
            console.warn("Could not calculate right elbow angle");
        }
    }
    // Left knee angle (hip-knee-ankle)
    if (shouldTrack("left_knee")) {
        try {
            const leftKneeAngle = calculateAngle(getLandmark(POSE_LANDMARKS.LEFT_HIP), getLandmark(POSE_LANDMARKS.LEFT_KNEE), getLandmark(POSE_LANDMARKS.LEFT_ANKLE));
            angles.push({
                joint: "left_knee",
                angle: leftKneeAngle
            });
        } catch (e) {
            console.warn("Could not calculate left knee angle");
        }
    }
    // Right knee angle (hip-knee-ankle)
    if (shouldTrack("right_knee")) {
        try {
            const rightKneeAngle = calculateAngle(getLandmark(POSE_LANDMARKS.RIGHT_HIP), getLandmark(POSE_LANDMARKS.RIGHT_KNEE), getLandmark(POSE_LANDMARKS.RIGHT_ANKLE));
            angles.push({
                joint: "right_knee",
                angle: rightKneeAngle
            });
        } catch (e) {
            console.warn("Could not calculate right knee angle");
        }
    }
    // Left hip angle (shoulder-hip-knee)
    if (shouldTrack("left_hip")) {
        try {
            const leftHipAngle = calculateAngle(getLandmark(POSE_LANDMARKS.LEFT_SHOULDER), getLandmark(POSE_LANDMARKS.LEFT_HIP), getLandmark(POSE_LANDMARKS.LEFT_KNEE));
            angles.push({
                joint: "left_hip",
                angle: leftHipAngle
            });
        } catch (e) {
            console.warn("Could not calculate left hip angle");
        }
    }
    // Right hip angle (shoulder-hip-knee)
    if (shouldTrack("right_hip")) {
        try {
            const rightHipAngle = calculateAngle(getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER), getLandmark(POSE_LANDMARKS.RIGHT_HIP), getLandmark(POSE_LANDMARKS.RIGHT_KNEE));
            angles.push({
                joint: "right_hip",
                angle: rightHipAngle
            });
        } catch (e) {
            console.warn("Could not calculate right hip angle");
        }
    }
    // Left shoulder angle (elbow-shoulder-hip)
    if (shouldTrack("left_shoulder")) {
        try {
            const leftShoulderAngle = calculateAngle(getLandmark(POSE_LANDMARKS.LEFT_ELBOW), getLandmark(POSE_LANDMARKS.LEFT_SHOULDER), getLandmark(POSE_LANDMARKS.LEFT_HIP));
            angles.push({
                joint: "left_shoulder",
                angle: leftShoulderAngle
            });
        } catch (e) {
            console.warn("Could not calculate left shoulder angle");
        }
    }
    // Right shoulder angle (elbow-shoulder-hip)
    if (shouldTrack("right_shoulder")) {
        try {
            const rightShoulderAngle = calculateAngle(getLandmark(POSE_LANDMARKS.RIGHT_ELBOW), getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER), getLandmark(POSE_LANDMARKS.RIGHT_HIP));
            angles.push({
                joint: "right_shoulder",
                angle: rightShoulderAngle
            });
        } catch (e) {
            console.warn("Could not calculate right shoulder angle");
        }
    }
    // === SEGMENT ANGLES (Line angles relative to vertical) ===
    // These measure the angle of body segments, useful for knee extension, leg raises, etc.
    // Left leg segment (knee to ankle) angle from vertical
    if (shouldTrack("left_knee") || shouldTrack("left_ankle")) {
        try {
            const leftLegSegmentAngle = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.LEFT_KNEE), getLandmark(POSE_LANDMARKS.LEFT_ANKLE));
            angles.push({
                joint: "left_leg_segment",
                angle: leftLegSegmentAngle
            });
        } catch (e) {
            console.warn("Could not calculate left leg segment angle");
        }
    }
    // Right leg segment (knee to ankle) angle from vertical
    if (shouldTrack("right_knee") || shouldTrack("right_ankle")) {
        try {
            const rightLegSegmentAngle = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.RIGHT_KNEE), getLandmark(POSE_LANDMARKS.RIGHT_ANKLE));
            angles.push({
                joint: "right_leg_segment",
                angle: rightLegSegmentAngle
            });
        } catch (e) {
            console.warn("Could not calculate right leg segment angle");
        }
    }
    // Left thigh segment (hip to knee) angle from vertical
    if (shouldTrack("left_hip") || shouldTrack("left_knee")) {
        try {
            const leftThighSegmentAngle = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.LEFT_HIP), getLandmark(POSE_LANDMARKS.LEFT_KNEE));
            angles.push({
                joint: "left_thigh_segment",
                angle: leftThighSegmentAngle
            });
        } catch (e) {
            console.warn("Could not calculate left thigh segment angle");
        }
    }
    // Right thigh segment (hip to knee) angle from vertical
    if (shouldTrack("right_hip") || shouldTrack("right_knee")) {
        try {
            const rightThighSegmentAngle = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.RIGHT_HIP), getLandmark(POSE_LANDMARKS.RIGHT_KNEE));
            angles.push({
                joint: "right_thigh_segment",
                angle: rightThighSegmentAngle
            });
        } catch (e) {
            console.warn("Could not calculate right thigh segment angle");
        }
    }
    // Left arm segment (shoulder to elbow) angle from vertical
    if (shouldTrack("left_shoulder") || shouldTrack("left_elbow")) {
        try {
            const leftArmSegmentAngle = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.LEFT_SHOULDER), getLandmark(POSE_LANDMARKS.LEFT_ELBOW));
            angles.push({
                joint: "left_arm_segment",
                angle: leftArmSegmentAngle
            });
        } catch (e) {
            console.warn("Could not calculate left arm segment angle");
        }
    }
    // Right arm segment (shoulder to elbow) angle from vertical
    if (shouldTrack("right_shoulder") || shouldTrack("right_elbow")) {
        try {
            const rightArmSegmentAngle = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER), getLandmark(POSE_LANDMARKS.RIGHT_ELBOW));
            angles.push({
                joint: "right_arm_segment",
                angle: rightArmSegmentAngle
            });
        } catch (e) {
            console.warn("Could not calculate right arm segment angle");
        }
    }
    // Left forearm segment (elbow to wrist) angle from vertical
    if (shouldTrack("left_elbow")) {
        try {
            const leftForearmSegmentAngle = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.LEFT_ELBOW), getLandmark(POSE_LANDMARKS.LEFT_WRIST));
            angles.push({
                joint: "left_forearm_segment",
                angle: leftForearmSegmentAngle
            });
        } catch (e) {
            console.warn("Could not calculate left forearm segment angle");
        }
    }
    // Right forearm segment (elbow to wrist) angle from vertical
    if (shouldTrack("right_elbow")) {
        try {
            const rightForearmSegmentAngle = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.RIGHT_ELBOW), getLandmark(POSE_LANDMARKS.RIGHT_WRIST));
            angles.push({
                joint: "right_forearm_segment",
                angle: rightForearmSegmentAngle
            });
        } catch (e) {
            console.warn("Could not calculate right forearm segment angle");
        }
    }
    return angles;
}
/**
 * Apply additional angle-level smoothing using exponential moving average
 * This is a secondary smoothing layer after landmark smoothing
 * @param jointAngles Angle data (already from smoothed landmarks)
 * @param alpha Smoothing factor (0.0 = max smoothing, 1.0 = no smoothing)
 */ function smoothJointAnglesEMA(jointAngles, alpha = 0.3) {
    const smoothed = [];
    // Group by joint
    const jointGroups = new Map();
    jointAngles.forEach((ja)=>{
        if (!jointGroups.has(ja.joint)) {
            jointGroups.set(ja.joint, []);
        }
        jointGroups.get(ja.joint).push(ja);
    });
    // Smooth each joint's angles using EMA
    jointGroups.forEach((angles, joint)=>{
        // Sort by timestamp
        angles.sort((a, b)=>a.timestamp - b.timestamp);
        if (angles.length === 0) return;
        // First value is unchanged
        let prevSmoothed = angles[0].angle;
        smoothed.push(angles[0]);
        // Apply exponential smoothing
        for(let i = 1; i < angles.length; i++){
            const currentAngle = angles[i].angle;
            const smoothedAngle = alpha * currentAngle + (1 - alpha) * prevSmoothed;
            smoothed.push({
                joint: angles[i].joint,
                angle: smoothedAngle,
                timestamp: angles[i].timestamp
            });
            prevSmoothed = smoothedAngle;
        }
    });
    return smoothed;
}
/**
 * Detect significant movements from joint angle data
 */ function detectMovements(jointAngles) {
    const movements = [];
    const ANGLE_THRESHOLD = 20 // Minimum angle change to consider as movement
    ;
    const NOISE_THRESHOLD = 5 // Ignore changes smaller than this (reduced due to better smoothing)
    ;
    const TIME_THRESHOLD = 0.4 // Minimum time (seconds) to hold position
    ;
    // Apply additional angle-level smoothing (secondary layer)
    // Since landmarks are already smoothed, use lighter smoothing here
    const smoothedAngles = smoothJointAnglesEMA(jointAngles, 0.35);
    // Group by joint
    const jointGroups = new Map();
    smoothedAngles.forEach((ja)=>{
        if (!jointGroups.has(ja.joint)) {
            jointGroups.set(ja.joint, []);
        }
        jointGroups.get(ja.joint).push(ja);
    });
    // Analyze each joint
    jointGroups.forEach((angles, joint)=>{
        if (angles.length < 2) return;
        // Sort by timestamp to ensure chronological order
        angles.sort((a, b)=>a.timestamp - b.timestamp);
        let currentSegment = angles[0];
        let accumulatedDelta = 0;
        for(let i = 1; i < angles.length; i++){
            const angle = angles[i];
            const instantDelta = angle.angle - angles[i - 1].angle;
            const totalDelta = angle.angle - currentSegment.angle;
            const timeDelta = angle.timestamp - currentSegment.timestamp;
            // Ignore small jitters
            if (Math.abs(instantDelta) > NOISE_THRESHOLD) {
                accumulatedDelta += instantDelta;
            }
            // Detect significant movement
            if (Math.abs(totalDelta) > ANGLE_THRESHOLD && timeDelta >= TIME_THRESHOLD) {
                movements.push({
                    joint,
                    startAngle: currentSegment.angle,
                    endAngle: angle.angle,
                    startTime: currentSegment.timestamp,
                    endTime: angle.timestamp,
                    duration: angle.timestamp - currentSegment.timestamp,
                    angleDelta: angle.angle - currentSegment.angle
                });
                currentSegment = angle;
                accumulatedDelta = 0;
            } else if (i === angles.length - 1 && timeDelta >= TIME_THRESHOLD) {
                // Last segment - check if there was any significant change
                if (Math.abs(totalDelta) > ANGLE_THRESHOLD) {
                    movements.push({
                        joint,
                        startAngle: currentSegment.angle,
                        endAngle: angle.angle,
                        startTime: currentSegment.timestamp,
                        endTime: angle.timestamp,
                        duration: angle.timestamp - currentSegment.timestamp,
                        angleDelta: angle.angle - currentSegment.angle
                    });
                }
            }
        }
    });
    // Filter out movements that are too small in total change
    const significantMovements = movements.filter((m)=>Math.abs(m.angleDelta) > ANGLE_THRESHOLD);
    return significantMovements.sort((a, b)=>a.startTime - b.startTime);
}
/**
 * Generate human-readable summary of movements
 */ function generateSummary(movements) {
    if (movements.length === 0) {
        return "No significant movements detected.";
    }
    const summaryLines = [];
    // Group movements by type (joint angles vs segment angles)
    const jointMovements = movements.filter((m)=>!m.joint.includes("_segment"));
    const segmentMovements = movements.filter((m)=>m.joint.includes("_segment"));
    if (jointMovements.length > 0) {
        summaryLines.push("=== JOINT ANGLES (Flexion/Extension) ===");
        jointMovements.forEach((movement, index)=>{
            const jointName = movement.joint.replace("_", " ").toUpperCase();
            const totalChange = Math.abs(movement.angleDelta).toFixed(1);
            const changeDirection = movement.angleDelta > 0 ? "+" : "";
            // Determine movement type for joints
            let movementType = "";
            if (movement.joint.includes("knee") || movement.joint.includes("elbow")) {
                movementType = movement.angleDelta < 0 ? "flexed (bent)" : "extended (straightened)";
            } else if (movement.joint.includes("hip") || movement.joint.includes("shoulder")) {
                movementType = movement.angleDelta < 0 ? "closed" : "opened";
            } else {
                movementType = movement.angleDelta > 0 ? "increased" : "decreased";
            }
            summaryLines.push(`${index + 1}. ${jointName}: ${movementType} by ${totalChange}° ` + `(went from ${movement.startAngle.toFixed(0)}° to ${movement.endAngle.toFixed(0)}°, change: ${changeDirection}${movement.angleDelta.toFixed(1)}°) ` + `at ${movement.startTime.toFixed(1)}s for ${movement.duration.toFixed(1)}s`);
        });
    }
    if (segmentMovements.length > 0) {
        if (jointMovements.length > 0) summaryLines.push("");
        summaryLines.push("=== SEGMENT ANGLES (Relative to Vertical) ===");
        segmentMovements.forEach((movement, index)=>{
            const segmentName = movement.joint.replace("_segment", "").replace("_", " ").toUpperCase();
            const totalChange = Math.abs(movement.angleDelta).toFixed(1);
            const changeDirection = movement.angleDelta > 0 ? "+" : "";
            // Determine movement direction for segments
            let direction = "";
            if (movement.angleDelta > 0) {
                direction = "raised/moved away from vertical";
            } else {
                direction = "lowered/moved toward vertical";
            }
            summaryLines.push(`${index + 1}. ${segmentName}: ${direction} by ${totalChange}° ` + `(went from ${movement.startAngle.toFixed(0)}° to ${movement.endAngle.toFixed(0)}°, change: ${changeDirection}${movement.angleDelta.toFixed(1)}°) ` + `at ${movement.startTime.toFixed(1)}s for ${movement.duration.toFixed(1)}s`);
        });
    }
    return summaryLines.join("\n");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/exercise-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Exercise configurations with specific angles to track
 */ __turbopack_context__.s([
    "EXERCISE_CONFIGS",
    ()=>EXERCISE_CONFIGS,
    "filterAnglesByExercise",
    ()=>filterAnglesByExercise,
    "getAnglesFromJoints",
    ()=>getAnglesFromJoints,
    "getExerciseConfig",
    ()=>getExerciseConfig
]);
const EXERCISE_CONFIGS = [
    {
        id: "knee-extension",
        name: "Knee Extension",
        description: "Extending the knee from bent to straight position",
        anglesOfInterest: [
            // Joint angles (3-point)
            "left_knee",
            "right_knee",
            // Segment angles (2-point relative to vertical)
            // these are kinda irrelevant i think because why bother tracking joints when youo're getting angles anyway
            "left_leg_segment",
            "right_leg_segment",
            "left_thigh_segment",
            "right_thigh_segment"
        ],
        angleConfigs: [
            {
                type: "joint",
                name: "left_knee",
                description: "Left knee joint angle (hip-knee-ankle)"
            },
            {
                type: "joint",
                name: "right_knee",
                description: "Right knee joint angle (hip-knee-ankle)"
            },
            {
                type: "segment",
                name: "left_leg_segment",
                description: "Left lower leg angle from vertical (knee-ankle)"
            },
            {
                type: "segment",
                name: "right_leg_segment",
                description: "Right lower leg angle from vertical (knee-ankle)"
            },
            {
                type: "segment",
                name: "left_thigh_segment",
                description: "Left thigh angle from vertical (hip-knee)"
            },
            {
                type: "segment",
                name: "right_thigh_segment",
                description: "Right thigh angle from vertical (hip-knee)"
            }
        ]
    },
    {
        id: "bicep-curl",
        name: "Bicep Curl",
        description: "Curling the arm to work the bicep muscle",
        anglesOfInterest: [
            "left_elbow",
            "right_elbow"
        ],
        angleConfigs: [
            {
                type: "joint",
                name: "left_elbow",
                description: "Left elbow joint angle (shoulder-elbow-wrist)"
            },
            {
                type: "joint",
                name: "right_elbow",
                description: "Right elbow joint angle (shoulder-elbow-wrist)"
            }
        ]
    },
    {
        id: "squat",
        name: "Squat",
        description: "Full body squat movement",
        anglesOfInterest: [
            "left_knee",
            "right_knee",
            "left_hip",
            "right_hip",
            "left_thigh_segment",
            "right_thigh_segment"
        ],
        angleConfigs: [
            {
                type: "joint",
                name: "left_knee",
                description: "Left knee joint angle"
            },
            {
                type: "joint",
                name: "right_knee",
                description: "Right knee joint angle"
            },
            {
                type: "joint",
                name: "left_hip",
                description: "Left hip joint angle (shoulder-hip-knee)"
            },
            {
                type: "joint",
                name: "right_hip",
                description: "Right hip joint angle (shoulder-hip-knee)"
            },
            {
                type: "segment",
                name: "left_thigh_segment",
                description: "Left thigh angle from vertical"
            },
            {
                type: "segment",
                name: "right_thigh_segment",
                description: "Right thigh angle from vertical"
            }
        ]
    },
    {
        id: "shoulder-press",
        name: "Shoulder Press",
        description: "Pressing arms overhead",
        anglesOfInterest: [
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_arm_segment",
            "right_arm_segment"
        ],
        angleConfigs: [
            {
                type: "joint",
                name: "left_shoulder",
                description: "Left shoulder joint angle"
            },
            {
                type: "joint",
                name: "right_shoulder",
                description: "Right shoulder joint angle"
            },
            {
                type: "joint",
                name: "left_elbow",
                description: "Left elbow joint angle"
            },
            {
                type: "joint",
                name: "right_elbow",
                description: "Right elbow joint angle"
            },
            {
                type: "segment",
                name: "left_arm_segment",
                description: "Left upper arm angle from vertical"
            },
            {
                type: "segment",
                name: "right_arm_segment",
                description: "Right upper arm angle from vertical"
            }
        ]
    },
    {
        id: "leg-raise",
        name: "Leg Raise",
        description: "Raising the leg from hip",
        anglesOfInterest: [
            "left_hip",
            "right_hip",
            "left_thigh_segment",
            "right_thigh_segment"
        ],
        angleConfigs: [
            {
                type: "joint",
                name: "left_hip",
                description: "Left hip joint angle"
            },
            {
                type: "joint",
                name: "right_hip",
                description: "Right hip joint angle"
            },
            {
                type: "segment",
                name: "left_thigh_segment",
                description: "Left thigh angle from vertical"
            },
            {
                type: "segment",
                name: "right_thigh_segment",
                description: "Right thigh angle from vertical"
            }
        ]
    },
    {
        id: "custom",
        name: "Custom Exercise",
        description: "Track all joints and segments",
        anglesOfInterest: [
            "left_elbow",
            "right_elbow",
            "left_knee",
            "right_knee",
            "left_hip",
            "right_hip",
            "left_shoulder",
            "right_shoulder",
            "left_leg_segment",
            "right_leg_segment",
            "left_thigh_segment",
            "right_thigh_segment",
            "left_arm_segment",
            "right_arm_segment",
            "left_forearm_segment",
            "right_forearm_segment"
        ],
        angleConfigs: [
            {
                type: "joint",
                name: "left_elbow",
                description: "Left elbow angle"
            },
            {
                type: "joint",
                name: "right_elbow",
                description: "Right elbow angle"
            },
            {
                type: "joint",
                name: "left_knee",
                description: "Left knee angle"
            },
            {
                type: "joint",
                name: "right_knee",
                description: "Right knee angle"
            },
            {
                type: "joint",
                name: "left_hip",
                description: "Left hip angle"
            },
            {
                type: "joint",
                name: "right_hip",
                description: "Right hip angle"
            },
            {
                type: "joint",
                name: "left_shoulder",
                description: "Left shoulder angle"
            },
            {
                type: "joint",
                name: "right_shoulder",
                description: "Right shoulder angle"
            },
            {
                type: "segment",
                name: "left_leg_segment",
                description: "Left lower leg segment"
            },
            {
                type: "segment",
                name: "right_leg_segment",
                description: "Right lower leg segment"
            },
            {
                type: "segment",
                name: "left_thigh_segment",
                description: "Left thigh segment"
            },
            {
                type: "segment",
                name: "right_thigh_segment",
                description: "Right thigh segment"
            },
            {
                type: "segment",
                name: "left_arm_segment",
                description: "Left upper arm segment"
            },
            {
                type: "segment",
                name: "right_arm_segment",
                description: "Right upper arm segment"
            },
            {
                type: "segment",
                name: "left_forearm_segment",
                description: "Left forearm segment"
            },
            {
                type: "segment",
                name: "right_forearm_segment",
                description: "Right forearm segment"
            }
        ]
    }
];
function getExerciseConfig(exerciseId) {
    return EXERCISE_CONFIGS.find((config)=>config.id === exerciseId);
}
function filterAnglesByExercise(allAngles, exerciseId) {
    const config = getExerciseConfig(exerciseId);
    if (!config) return allAngles;
    return allAngles.filter((angle)=>config.anglesOfInterest.includes(angle));
}
function getAnglesFromJoints(joints) {
    const angles = [];
    joints.forEach((joint)=>{
        // Add the joint angle itself
        angles.push(joint);
        // Add related segment angles
        if (joint.includes("knee") || joint.includes("ankle")) {
            const side = joint.includes("left") ? "left" : "right";
            angles.push(`${side}_leg_segment`);
            angles.push(`${side}_thigh_segment`);
        }
        if (joint.includes("hip")) {
            const side = joint.includes("left") ? "left" : "right";
            angles.push(`${side}_thigh_segment`);
        }
        if (joint.includes("elbow") || joint.includes("wrist")) {
            const side = joint.includes("left") ? "left" : "right";
            angles.push(`${side}_arm_segment`);
            angles.push(`${side}_forearm_segment`);
        }
        if (joint.includes("shoulder")) {
            const side = joint.includes("left") ? "left" : "right";
            angles.push(`${side}_arm_segment`);
        }
    });
    return [
        ...new Set(angles)
    ] // Remove duplicates
    ;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/comparison-recorder.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComparisonRecorder",
    ()=>ComparisonRecorder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mediapipe+tasks-vision@0.10.22-rc.20250304/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const POSE_LANDMARKS = {
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28
};
class OneEuroFilter {
    min_cutoff;
    beta;
    d_cutoff;
    x_prev;
    dx_prev;
    t_prev;
    constructor(min_cutoff = 1.0, beta = 0.007, d_cutoff = 1.0){
        this.min_cutoff = min_cutoff;
        this.beta = beta;
        this.d_cutoff = d_cutoff;
        this.x_prev = 0;
        this.dx_prev = 0;
        this.t_prev = 0;
    }
    smoothingFactor(t_e, cutoff) {
        const r = 2 * Math.PI * cutoff * t_e;
        return r / (r + 1);
    }
    exponentialSmoothing(a, x, x_prev) {
        return a * x + (1 - a) * x_prev;
    }
    filter(x, t) {
        const t_e = this.t_prev === 0 ? 0.016 : t - this.t_prev;
        if (t_e === 0) {
            return x;
        }
        const dx = (x - this.x_prev) / t_e;
        const edx = this.exponentialSmoothing(this.smoothingFactor(t_e, this.d_cutoff), dx, this.dx_prev);
        const cutoff = this.min_cutoff + this.beta * Math.abs(edx);
        const x_filtered = this.exponentialSmoothing(this.smoothingFactor(t_e, cutoff), x, this.x_prev);
        this.x_prev = x_filtered;
        this.dx_prev = edx;
        this.t_prev = t;
        return x_filtered;
    }
    reset() {
        this.x_prev = 0;
        this.dx_prev = 0;
        this.t_prev = 0;
    }
}
function ComparisonRecorder({ onVideoRecorded, anglesOfInterest, exerciseName, enableTestMode = false }) {
    _s();
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const poseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isStreaming, setIsStreaming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentAngles, setCurrentAngles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [repCount, setRepCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [correctRepCount, setCorrectRepCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [incorrectRepCount, setIncorrectRepCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currentState, setCurrentState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [repDetails, setRepDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [testMode, setTestMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [testVideoFile, setTestVideoFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const angleFiltersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const angleHistoryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const lastStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    const hasVisitedPeakRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastExtendedTimestampRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastRepTimestampRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const MIN_EXTENDED_HOLD = 0.2 // seconds to hold extended before a rep can be counted
    ;
    const MIN_REP_COOLDOWN = 0.6 // seconds between reps to avoid initial extra and double counts
    ;
    // Hysteresis thresholds for robust rep detection on primary angle
    const PRIMARY_UP_THRESHOLD = 140 // consider moving upward (extension) when crossing above
    ;
    const PRIMARY_DOWN_THRESHOLD = 100 // consider moving downward (flexion) when crossing below
    ;
    const MIN_PEAK_DELTA = 15 // minimum change between valley and peak to count a rep
    ;
    const repFSMRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        phase: 'idle'
    });
    const classifyRepQuality = (cycleHistory, primaryAngleName)=>{
        // Simple heuristic: a correct rep must reach full extension and return close to rest
        const name = primaryAngleName || anglesOfInterest && anglesOfInterest[0] || "right_knee";
        const values = cycleHistory.map((h)=>h.angles[name]).filter((v)=>v !== undefined);
        if (values.length === 0) return false;
        const maxAngle = Math.max(...values);
        const minAngle = Math.min(...values);
        // Default expected ranges; can be tuned per-exercise
        const EXTENDED_MIN = 150;
        const REST_MAX = 90;
        const isExtendedReached = maxAngle >= EXTENDED_MIN;
        const isRestReached = minAngle <= REST_MAX;
        return isExtendedReached && isRestReached;
    };
    const computeRepMinMax = (cycleHistory, primaryAngleName)=>{
        const name = primaryAngleName || anglesOfInterest && anglesOfInterest[0] || "right_knee";
        const values = cycleHistory.map((h)=>h.angles[name]).filter((v)=>v !== undefined);
        if (values.length === 0) return null;
        return {
            min: Math.min(...values),
            max: Math.max(...values),
            primary: name
        };
    };
    const POSE_CONNECTIONS = [
        // Face
        {
            start: 0,
            end: 1
        },
        {
            start: 1,
            end: 2
        },
        {
            start: 2,
            end: 3
        },
        {
            start: 3,
            end: 7
        },
        {
            start: 0,
            end: 4
        },
        {
            start: 4,
            end: 5
        },
        {
            start: 5,
            end: 6
        },
        {
            start: 6,
            end: 8
        },
        {
            start: 9,
            end: 10
        },
        // Torso
        {
            start: 11,
            end: 12
        },
        {
            start: 11,
            end: 23
        },
        {
            start: 12,
            end: 24
        },
        {
            start: 23,
            end: 24
        },
        // Left arm
        {
            start: 11,
            end: 13
        },
        {
            start: 13,
            end: 15
        },
        {
            start: 15,
            end: 17
        },
        {
            start: 15,
            end: 19
        },
        {
            start: 15,
            end: 21
        },
        {
            start: 17,
            end: 19
        },
        // Right arm
        {
            start: 12,
            end: 14
        },
        {
            start: 14,
            end: 16
        },
        {
            start: 16,
            end: 18
        },
        {
            start: 16,
            end: 20
        },
        {
            start: 16,
            end: 22
        },
        {
            start: 18,
            end: 20
        },
        // Left leg
        {
            start: 23,
            end: 25
        },
        {
            start: 25,
            end: 27
        },
        {
            start: 27,
            end: 29
        },
        {
            start: 27,
            end: 31
        },
        {
            start: 29,
            end: 31
        },
        // Right leg
        {
            start: 24,
            end: 26
        },
        {
            start: 26,
            end: 28
        },
        {
            start: 28,
            end: 30
        },
        {
            start: 28,
            end: 32
        },
        {
            start: 30,
            end: 32
        }
    ];
    const calculateAngle = (a, b, c)=>{
        const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
        let angle = Math.abs(radians * 180.0 / Math.PI);
        if (angle > 180.0) {
            angle = 360.0 - angle;
        }
        return angle;
    };
    const calculateSegmentAngleFromVertical = (start, end)=>{
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const radians = Math.atan2(dx, dy);
        const degrees = Math.abs(radians * 180.0 / Math.PI);
        return degrees;
    };
    const calculateAllAngles = (landmarks)=>{
        const angles = {};
        const getLandmark = (index)=>[
                landmarks[index].x,
                landmarks[index].y
            ];
        try {
            angles.left_elbow = calculateAngle(getLandmark(POSE_LANDMARKS.LEFT_SHOULDER), getLandmark(POSE_LANDMARKS.LEFT_ELBOW), getLandmark(POSE_LANDMARKS.LEFT_WRIST));
            angles.right_elbow = calculateAngle(getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER), getLandmark(POSE_LANDMARKS.RIGHT_ELBOW), getLandmark(POSE_LANDMARKS.RIGHT_WRIST));
            angles.left_knee = calculateAngle(getLandmark(POSE_LANDMARKS.LEFT_HIP), getLandmark(POSE_LANDMARKS.LEFT_KNEE), getLandmark(POSE_LANDMARKS.LEFT_ANKLE));
            angles.right_knee = calculateAngle(getLandmark(POSE_LANDMARKS.RIGHT_HIP), getLandmark(POSE_LANDMARKS.RIGHT_KNEE), getLandmark(POSE_LANDMARKS.RIGHT_ANKLE));
            angles.left_hip = calculateAngle(getLandmark(POSE_LANDMARKS.LEFT_SHOULDER), getLandmark(POSE_LANDMARKS.LEFT_HIP), getLandmark(POSE_LANDMARKS.LEFT_KNEE));
            angles.right_hip = calculateAngle(getLandmark(POSE_LANDMARKS.RIGHT_SHOULDER), getLandmark(POSE_LANDMARKS.RIGHT_HIP), getLandmark(POSE_LANDMARKS.RIGHT_KNEE));
            angles.left_leg_segment = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.LEFT_KNEE), getLandmark(POSE_LANDMARKS.LEFT_ANKLE));
            angles.right_leg_segment = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.RIGHT_KNEE), getLandmark(POSE_LANDMARKS.RIGHT_ANKLE));
            angles.left_thigh_segment = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.LEFT_HIP), getLandmark(POSE_LANDMARKS.LEFT_KNEE));
            angles.right_thigh_segment = calculateSegmentAngleFromVertical(getLandmark(POSE_LANDMARKS.RIGHT_HIP), getLandmark(POSE_LANDMARKS.RIGHT_KNEE));
        } catch (e) {
            console.warn("Error calculating some angles:", e);
        }
        return angles;
    };
    const smoothAngles = (rawAngles, timestamp)=>{
        const smoothed = {};
        Object.entries(rawAngles).forEach(([angleName, angleValue])=>{
            if (!angleFiltersRef.current.has(angleName)) {
                angleFiltersRef.current.set(angleName, new OneEuroFilter(1.0, 0.007));
            }
            const filter = angleFiltersRef.current.get(angleName);
            smoothed[angleName] = filter.filter(angleValue, timestamp);
        });
        return smoothed;
    };
    const determineExerciseState = (angles)=>{
        // Pick a sensible default primary angle if none provided
        let primaryAngle = anglesOfInterest && anglesOfInterest.length > 0 ? anglesOfInterest[0] : "right_knee";
        // If the chosen angle is missing, try a couple of common fallbacks
        let angle = angles[primaryAngle];
        if (angle === undefined) {
            const fallbacks = [
                "left_knee",
                "right_elbow",
                "left_elbow",
                "right_hip",
                "left_hip"
            ];
            const found = fallbacks.find((name)=>angles[name] !== undefined);
            if (!found) return "";
            primaryAngle = found;
            angle = angles[primaryAngle];
        }
        // thresholds here are assumed - because it makes it easier to run state detection later on 
        // state detection then knows what to look for
        if (angle < 70) {
            return "flexed";
        } else if (angle > 150) {
            return "extended";
        } else {
            return "transition";
        }
    };
    // Velocity + hysteresis based rep counting independent of coarse state
    const updateRepCount = (state)=>{
        // Derive primary angle reading
        const primaryName = anglesOfInterest && anglesOfInterest[0] || 'right_knee';
        const last = angleHistoryRef.current[angleHistoryRef.current.length - 1];
        const prev = angleHistoryRef.current[angleHistoryRef.current.length - 2];
        if (!last || !prev) {
            lastStateRef.current = state;
            return;
        }
        const a = last.angles[primaryName];
        const b = prev.angles[primaryName];
        if (a === undefined || b === undefined) {
            lastStateRef.current = state;
            return;
        }
        const nowTs = last.timestamp;
        const vel = a - b;
        const fsm = repFSMRef.current;
        // Initialize valley at start
        if (fsm.phase === 'idle') {
            fsm.lastValley = a;
            fsm.phase = 'down';
        }
        // Upward phase detection (extension)
        if (fsm.phase === 'down') {
            // Start going up when crossing upper threshold or velocity positive
            if (a >= PRIMARY_UP_THRESHOLD && vel > 0) {
                fsm.phase = 'up';
                fsm.lastPeak = a;
            }
            // Track valley
            if (fsm.lastValley === undefined || a < fsm.lastValley) fsm.lastValley = a;
        } else if (fsm.phase === 'up') {
            // Update peak while ascending
            if (fsm.lastPeak === undefined || a > fsm.lastPeak) fsm.lastPeak = a;
            // Transition back down when crossing lower threshold or velocity negative
            if (a <= PRIMARY_DOWN_THRESHOLD && vel < 0) {
                // Decide if a valid rep occurred
                const valley = fsm.lastValley ?? a;
                const peak = fsm.lastPeak ?? a;
                const delta = peak - valley;
                const cooledDown = lastRepTimestampRef.current === null || nowTs - lastRepTimestampRef.current >= MIN_REP_COOLDOWN;
                if (delta >= MIN_PEAK_DELTA && cooledDown) {
                    setRepCount((r)=>r + 1);
                    lastRepTimestampRef.current = nowTs;
                    // Build cycle window: last 1.5s
                    const cycle = angleHistoryRef.current.filter((h)=>nowTs - h.timestamp <= 1.5);
                    const isCorrect = classifyRepQuality(cycle, primaryName);
                    const minMax = computeRepMinMax(cycle, primaryName);
                    if (isCorrect) setCorrectRepCount((c)=>c + 1);
                    else setIncorrectRepCount((c)=>c + 1);
                    if (minMax) {
                        setRepDetails((prev)=>[
                                ...prev,
                                {
                                    index: prev.length + 1,
                                    startTime: cycle.length ? cycle[0].timestamp : nowTs - 1.5,
                                    endTime: nowTs,
                                    primaryAngle: minMax.primary,
                                    minAngle: Math.round(minMax.min),
                                    maxAngle: Math.round(minMax.max),
                                    correct: isCorrect
                                }
                            ]);
                    }
                }
                // Reset for next cycle
                fsm.phase = 'down';
                fsm.lastValley = a;
                fsm.lastPeak = undefined;
            }
        }
        lastStateRef.current = state;
    };
    const openWebcam = async ()=>{
        if (isStreaming || isLoading) return;
        setIsLoading(true);
        setTestMode(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch(()=>{});
                if (canvasRef.current) {
                    canvasRef.current.width = videoRef.current.videoWidth || 640;
                    canvasRef.current.height = videoRef.current.videoHeight || 480;
                }
                await initPose();
                startPoseLoop();
            }
            setIsStreaming(true);
        } catch (e) {
            console.error("Failed to open webcam", e);
            alert("Unable to access camera. Please check permissions and try again.");
        } finally{
            setIsLoading(false);
        }
    };
    const handleTestVideoUpload = async (event)=>{
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith('video/')) {
            alert("Please select a valid video file");
            return;
        }
        setIsLoading(true);
        setTestVideoFile(file);
        try {
            const videoUrl = URL.createObjectURL(file);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = videoUrl;
                videoRef.current.loop = true;
                await new Promise((resolve)=>{
                    videoRef.current.onloadedmetadata = ()=>{
                        if (canvasRef.current && videoRef.current) {
                            canvasRef.current.width = videoRef.current.videoWidth;
                            canvasRef.current.height = videoRef.current.videoHeight;
                        }
                        resolve();
                    };
                });
                await initPose();
                setTestMode(true);
                setIsStreaming(true);
                // Start playing and processing
                await videoRef.current.play();
                setIsPlaying(true);
                startPoseLoop();
            }
        } catch (e) {
            console.error("Failed to load test video:", e);
            alert("Failed to load video file");
        } finally{
            setIsLoading(false);
        }
    };
    const togglePlayPause = ()=>{
        if (!videoRef.current || !testMode) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };
    const resetTestVideo = ()=>{
        if (!videoRef.current || !testMode) return;
        videoRef.current.currentTime = 0;
        setRepCount(0);
        setCurrentState("");
        setCurrentAngles({});
        lastStateRef.current = "";
        hasVisitedPeakRef.current = false;
        angleFiltersRef.current.clear();
        angleHistoryRef.current = [];
        setRepDetails([]);
        repFSMRef.current = {
            phase: 'idle'
        };
    };
    // NEW: Stop test mode
    const stopTestMode = ()=>{
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.src = "";
        }
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        setTestMode(false);
        setIsStreaming(false);
        setIsPlaying(false);
        setTestVideoFile(null);
        setRepCount(0);
        setCurrentState("");
        setCurrentAngles({});
        lastStateRef.current = "";
        hasVisitedPeakRef.current = false;
        angleFiltersRef.current.clear();
        angleHistoryRef.current = [];
        setRepDetails([]);
        repFSMRef.current = {
            phase: 'idle'
        };
    };
    const initPose = async ()=>{
        try {
            if (poseRef.current) return;
            const vision = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilesetResolver"].forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm");
            poseRef.current = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PoseLandmarker"].createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numPoses: 1,
                minPoseDetectionConfidence: 0.5,
                minPosePresenceConfidence: 0.5,
                minTrackingConfidence: 0.5,
                outputSegmentationMasks: false
            });
        } catch (err) {
            console.error("Failed to init MediaPipe Pose", err);
        }
    };
    const startPoseLoop = ()=>{
        if (!videoRef.current || !canvasRef.current || !poseRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        const drawer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DrawingUtils"](ctx);
        const render = ()=>{
            if (!videoRef.current || !poseRef.current || !canvasRef.current) return;
            if (canvasRef.current.width !== videoRef.current.videoWidth || canvasRef.current.height !== videoRef.current.videoHeight) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
            }
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            const ts = performance.now();
            const result = poseRef.current.detectForVideo(videoRef.current, ts);
            if (result.landmarks && result.landmarks.length > 0) {
                const landmarks = result.landmarks[0];
                // Calculate all angles
                const rawAngles = calculateAllAngles(landmarks);
                const smoothedAngles = smoothAngles(rawAngles, ts / 1000);
                setCurrentAngles(smoothedAngles);
                angleHistoryRef.current.push({
                    timestamp: ts / 1000,
                    angles: smoothedAngles
                });
                const cutoffTime = ts / 1000 - 10;
                angleHistoryRef.current = angleHistoryRef.current.filter((h)=>h.timestamp > cutoffTime);
                const state = determineExerciseState(smoothedAngles);
                if (state) {
                    setCurrentState(state);
                    updateRepCount(state);
                }
                drawer.drawConnectors(landmarks, POSE_CONNECTIONS, {
                    color: "#22c55e",
                    lineWidth: 3
                });
                drawer.drawLandmarks(landmarks, {
                    radius: 4,
                    fillColor: "#22c55e",
                    color: "#16a34a",
                    lineWidth: 2
                });
                drawAngleAnnotations(ctx, landmarks, smoothedAngles);
            }
            rafRef.current = requestAnimationFrame(render);
        };
        rafRef.current = requestAnimationFrame(render);
    };
    const drawAngleAnnotations = (ctx, landmarks, angles)=>{
        const width = canvasRef.current?.width || 640;
        const height = canvasRef.current?.height || 480;
        const shouldDisplay = (angleName)=>{
            if (!anglesOfInterest || anglesOfInterest.length === 0) return true;
            return anglesOfInterest.includes(angleName);
        };
        if (shouldDisplay("right_knee") && angles.right_knee !== undefined) {
            const knee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
            ctx.fillStyle = "#00ffff";
            ctx.font = "bold 20px Arial";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 4;
            const text = `${Math.round(angles.right_knee)}°`;
            const x = knee.x * width + 15;
            const y = knee.y * height - 10;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
        if (shouldDisplay("left_knee") && angles.left_knee !== undefined) {
            const knee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
            ctx.fillStyle = "#00ffff";
            ctx.font = "bold 20px Arial";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 4;
            const text = `${Math.round(angles.left_knee)}°`;
            const x = knee.x * width - 65;
            const y = knee.y * height - 10;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
        if (shouldDisplay("right_elbow") && angles.right_elbow !== undefined) {
            const elbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
            ctx.fillStyle = "#ff00ff";
            ctx.font = "bold 18px Arial";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 4;
            const text = `${Math.round(angles.right_elbow)}°`;
            const x = elbow.x * width + 12;
            const y = elbow.y * height;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
        if (shouldDisplay("left_elbow") && angles.left_elbow !== undefined) {
            const elbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
            ctx.fillStyle = "#ff00ff";
            ctx.font = "bold 18px Arial";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 4;
            const text = `${Math.round(angles.left_elbow)}°`;
            const x = elbow.x * width - 60;
            const y = elbow.y * height;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
        if (shouldDisplay("right_hip") && angles.right_hip !== undefined) {
            const hip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
            ctx.fillStyle = "#ffaa00";
            ctx.font = "bold 18px Arial";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 4;
            const text = `${Math.round(angles.right_hip)}°`;
            const x = hip.x * width + 12;
            const y = hip.y * height + 5;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
        if (shouldDisplay("left_hip") && angles.left_hip !== undefined) {
            const hip = landmarks[POSE_LANDMARKS.LEFT_HIP];
            ctx.fillStyle = "#ffaa00";
            ctx.font = "bold 18px Arial";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 4;
            const text = `${Math.round(angles.left_hip)}°`;
            const x = hip.x * width - 60;
            const y = hip.y * height + 5;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
        if (shouldDisplay("right_leg_segment") && angles.right_leg_segment !== undefined) {
            const knee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
            ctx.fillStyle = "#ffffff";
            ctx.font = "14px Arial";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 3;
            const text = `seg: ${Math.round(angles.right_leg_segment)}°`;
            const x = knee.x * width + 15;
            const y = knee.y * height + 25;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
        if (shouldDisplay("left_leg_segment") && angles.left_leg_segment !== undefined) {
            const knee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
            ctx.fillStyle = "#ffffff";
            ctx.font = "14px Arial";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 3;
            const text = `seg: ${Math.round(angles.left_leg_segment)}°`;
            const x = knee.x * width - 80;
            const y = knee.y * height + 25;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComparisonRecorder.useEffect": ()=>{
            return ({
                "ComparisonRecorder.useEffect": ()=>{
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach({
                            "ComparisonRecorder.useEffect": (t)=>t.stop()
                        }["ComparisonRecorder.useEffect"]);
                        streamRef.current = null;
                    }
                    if (rafRef.current) {
                        cancelAnimationFrame(rafRef.current);
                        rafRef.current = null;
                    }
                    if (poseRef.current) {
                        poseRef.current.close();
                        poseRef.current = null;
                    }
                }
            })["ComparisonRecorder.useEffect"];
        }
    }["ComparisonRecorder.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "p-6 space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: openWebcam,
                        disabled: isStreaming || isLoading,
                        className: "gap-2",
                        children: isLoading ? "Opening…" : "Open Webcam"
                    }, void 0, false, {
                        fileName: "[project]/components/comparison-recorder.tsx",
                        lineNumber: 777,
                        columnNumber: 9
                    }, this),
                    enableTestMode && !isStreaming && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: fileInputRef,
                                type: "file",
                                accept: "video/*",
                                onChange: handleTestVideoUpload,
                                className: "hidden"
                            }, void 0, false, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 783,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>fileInputRef.current?.click(),
                                disabled: isLoading,
                                variant: "outline",
                                className: "gap-2",
                                children: isLoading ? "Loading…" : "test with Video File"
                            }, void 0, false, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 790,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    testMode && isStreaming && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: togglePlayPause,
                                variant: "outline",
                                children: isPlaying ? "Pause" : "▶ Play"
                            }, void 0, false, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 802,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: resetTestVideo,
                                variant: "outline",
                                children: "Reset"
                            }, void 0, false, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 805,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: stopTestMode,
                                variant: "destructive",
                                children: "Stop Test"
                            }, void 0, false, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 808,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/components/comparison-recorder.tsx",
                lineNumber: 776,
                columnNumber: 7
            }, this),
            testMode && testVideoFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-500 rounded-lg p-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold text-yellow-900 dark:text-yellow-100",
                                children: "Test Mode Active"
                            }, void 0, false, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 819,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-yellow-700 dark:text-yellow-300",
                                children: [
                                    "Testing: ",
                                    testVideoFile.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 822,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/comparison-recorder.tsx",
                        lineNumber: 818,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/comparison-recorder.tsx",
                    lineNumber: 817,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/comparison-recorder.tsx",
                lineNumber: 816,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full bg-black rounded-lg overflow-hidden",
                style: {
                    aspectRatio: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                        ref: videoRef,
                        autoPlay: true,
                        playsInline: true,
                        muted: true,
                        className: "w-full h-auto"
                    }, void 0, false, {
                        fileName: "[project]/components/comparison-recorder.tsx",
                        lineNumber: 831,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        className: "absolute inset-0 w-full h-full"
                    }, void 0, false, {
                        fileName: "[project]/components/comparison-recorder.tsx",
                        lineNumber: 838,
                        columnNumber: 9
                    }, this),
                    isStreaming && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-4 border-2 border-green-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-green-400 font-semibold mb-1",
                                        children: "REPS"
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 847,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-5xl font-bold text-white",
                                        children: repCount
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 848,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 846,
                                columnNumber: 13
                            }, this),
                            currentState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-blue-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-blue-400 font-semibold mb-1",
                                        children: "STATE"
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 858,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white capitalize",
                                        children: currentState
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 859,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 857,
                                columnNumber: 15
                            }, this),
                            Object.keys(currentAngles).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-purple-400 font-semibold mb-2",
                                        children: "LIVE ANGLES"
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 865,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                                        children: anglesOfInterest && anglesOfInterest.length > 0 ? // Show only angles of interest if specified
                                        anglesOfInterest.map((angleName)=>{
                                            const angle = currentAngles[angleName];
                                            if (angle === undefined) return null;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-400 capitalize",
                                                        children: angleName.replace(/_/g, ' ')
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/comparison-recorder.tsx",
                                                        lineNumber: 875,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xl font-bold text-white",
                                                        children: [
                                                            Math.round(angle),
                                                            "°"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/comparison-recorder.tsx",
                                                        lineNumber: 878,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, angleName, true, {
                                                fileName: "[project]/components/comparison-recorder.tsx",
                                                lineNumber: 874,
                                                columnNumber: 25
                                            }, this);
                                        }) : Object.entries(currentAngles).filter(([name])=>!name.includes('segment')).slice(0, 6).map(([angleName, angle])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-400 capitalize",
                                                        children: angleName.replace(/_/g, ' ')
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/comparison-recorder.tsx",
                                                        lineNumber: 890,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xl font-bold text-white",
                                                        children: [
                                                            Math.round(angle),
                                                            "°"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/comparison-recorder.tsx",
                                                        lineNumber: 893,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, angleName, true, {
                                                fileName: "[project]/components/comparison-recorder.tsx",
                                                lineNumber: 889,
                                                columnNumber: 25
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 866,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 864,
                                columnNumber: 15
                            }, this),
                            repDetails.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border-2 border-emerald-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-emerald-400 font-semibold mb-2",
                                        children: "REP DETAILS"
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 905,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-auto pr-1",
                                        children: repDetails.map((rep)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold",
                                                                children: [
                                                                    "#",
                                                                    rep.index
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/comparison-recorder.tsx",
                                                                lineNumber: 910,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-gray-300",
                                                                children: rep.primaryAngle.replace(/_/g, ' ')
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/comparison-recorder.tsx",
                                                                lineNumber: 911,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2",
                                                                children: [
                                                                    "min ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-bold",
                                                                        children: [
                                                                            rep.minAngle,
                                                                            "°"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/comparison-recorder.tsx",
                                                                        lineNumber: 912,
                                                                        columnNumber: 52
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/comparison-recorder.tsx",
                                                                lineNumber: 912,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2",
                                                                children: [
                                                                    "max ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-bold",
                                                                        children: [
                                                                            rep.maxAngle,
                                                                            "°"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/comparison-recorder.tsx",
                                                                        lineNumber: 913,
                                                                        columnNumber: 52
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/comparison-recorder.tsx",
                                                                lineNumber: 913,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/comparison-recorder.tsx",
                                                        lineNumber: 909,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: rep.correct ? "px-2 py-1 rounded bg-green-600/40 text-green-200 border border-green-500/60 text-xs" : "px-2 py-1 rounded bg-red-600/40 text-red-200 border border-red-500/60 text-xs",
                                                        children: rep.correct ? "✔ correct" : "✖ incorrect"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/comparison-recorder.tsx",
                                                        lineNumber: 915,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, rep.index, true, {
                                                fileName: "[project]/components/comparison-recorder.tsx",
                                                lineNumber: 908,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 906,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 904,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/components/comparison-recorder.tsx",
                lineNumber: 830,
                columnNumber: 7
            }, this),
            isStreaming && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold text-blue-900 dark:text-blue-100 mb-2",
                        children: "realtime tracking guide"
                    }, void 0, false, {
                        fileName: "[project]/components/comparison-recorder.tsx",
                        lineNumber: 929,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "text-sm text-blue-800 dark:text-blue-200 space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    "• ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-cyan-400",
                                        children: "Cyan angles"
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 933,
                                        columnNumber: 19
                                    }, this),
                                    " = Joint angles (knee/elbow bends)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 933,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    "• ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-purple-400",
                                        children: "Purple angles"
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 934,
                                        columnNumber: 19
                                    }, this),
                                    " = Elbow angles"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 934,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    "• ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-orange-400",
                                        children: "Orange angles"
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 935,
                                        columnNumber: 19
                                    }, this),
                                    " = Hip angles"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 935,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: '• White "seg:" = Segment angles (relative to vertical)'
                            }, void 0, false, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 936,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "• Reps are counted automatically based on movement cycles"
                            }, void 0, false, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 937,
                                columnNumber: 13
                            }, this),
                            exerciseName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    "• Exercise: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold",
                                        children: exerciseName
                                    }, void 0, false, {
                                        fileName: "[project]/components/comparison-recorder.tsx",
                                        lineNumber: 938,
                                        columnNumber: 46
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/comparison-recorder.tsx",
                                lineNumber: 938,
                                columnNumber: 30
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/comparison-recorder.tsx",
                        lineNumber: 932,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/comparison-recorder.tsx",
                lineNumber: 928,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/comparison-recorder.tsx",
        lineNumber: 775,
        columnNumber: 5
    }, this);
}
_s(ComparisonRecorder, "azqODDO2zlFxphgJn2bwvEuMOHE=");
_c = ComparisonRecorder;
var _c;
__turbopack_context__.k.register(_c, "ComparisonRecorder");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/compare/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComparePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pose$2d$analyzer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pose-analyzer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$exercise$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/exercise-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as Video>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$comparison$2d$recorder$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/comparison-recorder.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
function ComparePage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const [exercise, setExercise] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadedFile, setUploadedFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadedVideoUrl, setUploadedVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAnalyzing, setIsAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [comparisonResult, setComparisonResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [videoError, setVideoError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [inputMethod, setInputMethod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComparePage.useEffect": ()=>{
            const ex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getExercise"])(params.id);
            if (ex) {
                console.log("Loaded exercise:", ex);
                console.log("Video URL:", ex.videoUrl);
                setExercise(ex);
            }
        }
    }["ComparePage.useEffect"], [
        params.id
    ]);
    const handleFileUpload = (event)=>{
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setUploadedFile(file);
            setUploadedVideoUrl(URL.createObjectURL(file));
            setComparisonResult(null);
            setError(null);
        } else {
            setError("Please upload a valid video file");
        }
    };
    const handleVideoRecorded = (videoBlob)=>{
        console.log("[ComparePage] Video recorded, blob size:", videoBlob.size);
        const file = new File([
            videoBlob
        ], 'recorded-video.webm', {
            type: 'video/webm'
        });
        setUploadedFile(file);
        setUploadedVideoUrl(URL.createObjectURL(videoBlob));
        setComparisonResult(null);
        setError(null);
    };
    const compareVideos = async ()=>{
        if (!uploadedFile || !exercise) return;
        setIsAnalyzing(true);
        setError(null);
        try {
            console.log("Starting video comparison...");
            // Check if reference video already has a learned template
            let referenceTemplate;
            if (exercise.learnedTemplate) {
                console.log("Using stored reference template");
                referenceTemplate = exercise.learnedTemplate;
            } else {
                console.warn("No stored template found, analyzing reference video...");
                const referenceBlob = await fetch(exercise.videoUrl).then((r)=>r.blob());
                const referenceAnalysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pose$2d$analyzer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["analyzeVideoForPose"])(referenceBlob, undefined, {
                    name: exercise.name,
                    type: exercise.type
                });
                if (!referenceAnalysis.learnedTemplate) {
                    throw new Error("Failed to learn reference exercise template");
                }
                referenceTemplate = referenceAnalysis.learnedTemplate;
            }
            console.log(" Analyzing uploaded video...");
            const exerciseConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$exercise$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getExerciseConfig"])(exercise.type);
            const anglesOfInterest = exerciseConfig?.anglesOfInterest;
            console.log(`Exercise type: ${exercise.type}`);
            console.log(`Exercise config:`, exerciseConfig);
            console.log(`Using angles of interest:`, anglesOfInterest);
            if (!anglesOfInterest || anglesOfInterest.length === 0) {
                console.warn("No angles of interest found, template learning may not work");
            }
            const uploadedAnalysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pose$2d$analyzer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["analyzeVideoForPose"])(uploadedFile, anglesOfInterest, {
                name: exercise.name,
                type: exercise.type
            });
            console.log("Uploaded analysis result:", uploadedAnalysis);
            console.log("Has learned template?", !!uploadedAnalysis.learnedTemplate);
            if (!uploadedAnalysis.learnedTemplate) {
                throw new Error(`Failed to learn uploaded exercise template. Video may be too short or no valid poses detected. Joint angles found: ${uploadedAnalysis.jointAngles.length}`);
            }
            console.log("Comparing templates...");
            const comparison = compareTemplates(referenceTemplate, uploadedAnalysis.learnedTemplate);
            setComparisonResult(comparison);
            console.log("Comparison complete:", comparison);
        } catch (err) {
            console.error("❌ Error comparing videos:", err);
            setError(err instanceof Error ? err.message : "Failed to compare videos");
        } finally{
            setIsAnalyzing(false);
        }
    };
    const compareTemplates = (reference, uploaded)=>{
        const stateMatches = {};
        const angleDeviations = {};
        reference.states.forEach((refState)=>{
            const closestMatch = uploaded.states.reduce((best, upState)=>{
                const similarity = calculateStateSimilarity(refState, upState);
                return similarity > best.similarity ? {
                    state: upState,
                    similarity
                } : best;
            }, {
                state: uploaded.states[0],
                similarity: 0
            });
            stateMatches[refState.name] = closestMatch.similarity;
        });
        const allAngles = new Set();
        reference.states.forEach((s)=>Object.keys(s.angleRanges).forEach((angle)=>allAngles.add(angle)));
        allAngles.forEach((angleName)=>{
            const refAngles = reference.states.map((s)=>s.angleRanges[angleName]?.mean).filter((a)=>a !== undefined);
            const upAngles = uploaded.states.map((s)=>s.angleRanges[angleName]?.mean).filter((a)=>a !== undefined);
            if (refAngles.length > 0 && upAngles.length > 0) {
                const refAvg = refAngles.reduce((a, b)=>a + b, 0) / refAngles.length;
                const upAvg = upAngles.reduce((a, b)=>a + b, 0) / upAngles.length;
                angleDeviations[angleName] = Math.abs(refAvg - upAvg);
            }
        });
        const stateSimilarity = Object.values(stateMatches).reduce((a, b)=>a + b, 0) / Object.values(stateMatches).length;
        const angleAccuracy = 100 - Math.min(100, Object.values(angleDeviations).reduce((a, b)=>a + b, 0) / Object.values(angleDeviations).length);
        const overallSimilarity = stateSimilarity * 0.6 + angleAccuracy * 0.4;
        return {
            similarity: Math.round(overallSimilarity),
            referenceReps: reference.recommendedReps,
            uploadedReps: uploaded.recommendedReps,
            details: {
                referenceTemplate: reference,
                uploadedTemplate: uploaded,
                stateMatches,
                angleDeviations
            }
        };
    };
    const calculateStateSimilarity = (state1, state2)=>{
        const angles1 = Object.keys(state1.angleRanges);
        const angles2 = Object.keys(state2.angleRanges);
        const commonAngles = angles1.filter((a)=>angles2.includes(a));
        if (commonAngles.length === 0) return 0;
        const similarities = commonAngles.map((angle)=>{
            const mean1 = state1.angleRanges[angle].mean;
            const mean2 = state2.angleRanges[angle].mean;
            const diff = Math.abs(mean1 - mean2);
            return Math.max(0, 100 - diff / 180 * 100);
        });
        return similarities.reduce((a, b)=>a + b, 0) / similarities.length;
    };
    if (!exercise) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "min-h-screen bg-background p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "Exercise not found"
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 244,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                className: "mt-4",
                                children: "Back Home"
                            }, void 0, false, {
                                fileName: "[project]/app/compare/[id]/page.tsx",
                                lineNumber: 246,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 245,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 243,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/compare/[id]/page.tsx",
                lineNumber: 242,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/compare/[id]/page.tsx",
            lineNumber: 241,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-background p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 260,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/compare/[id]/page.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 258,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold mb-2",
                            children: [
                                "Compare Videos - ",
                                exercise.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 266,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "Upload a video or record using your webcam to compare against the reference exercise"
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 265,
                    columnNumber: 9
                }, this),
                !inputMethod && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-6 cursor-pointer hover:border-primary transition-colors",
                            onClick: ()=>setInputMethod('upload'),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        className: "w-12 h-12 mx-auto text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 279,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold",
                                        children: "Upload Video"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 280,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Upload a pre-recorded video file from your device"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 281,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/compare/[id]/page.tsx",
                                lineNumber: 278,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 274,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-6 cursor-pointer hover:border-primary transition-colors",
                            onClick: ()=>setInputMethod('webcam'),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                        className: "w-12 h-12 mx-auto text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 291,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold",
                                        children: "Record with Webcam"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 292,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Record a new video using your webcam with real-time pose detection"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 293,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/compare/[id]/page.tsx",
                                lineNumber: 290,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 286,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 273,
                    columnNumber: 11
                }, this),
                inputMethod === 'upload' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold",
                                    children: "Upload Video for Comparison"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 306,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: ()=>{
                                        setInputMethod(null);
                                        setUploadedFile(null);
                                        setUploadedVideoUrl(null);
                                        setComparisonResult(null);
                                    },
                                    children: "Change Method"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 307,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 305,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    ref: fileInputRef,
                                    type: "file",
                                    accept: "video/*",
                                    onChange: handleFileUpload,
                                    className: "flex-1"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 321,
                                    columnNumber: 15
                                }, this),
                                uploadedFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: compareVideos,
                                    disabled: isAnalyzing,
                                    className: "gap-2",
                                    children: isAnalyzing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 23
                                            }, this),
                                            "Analyzing..."
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 341,
                                                columnNumber: 23
                                            }, this),
                                            "Compare Videos"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 329,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 320,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-3 bg-destructive/10 border border-destructive rounded-md",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-destructive",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/compare/[id]/page.tsx",
                                lineNumber: 350,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 349,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 304,
                    columnNumber: 11
                }, this),
                inputMethod === 'webcam' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold",
                                    children: "Record Using Webcam"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 361,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: ()=>{
                                        setInputMethod(null);
                                        setUploadedFile(null);
                                        setUploadedVideoUrl(null);
                                        setComparisonResult(null);
                                    },
                                    children: "Change Method"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 360,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$comparison$2d$recorder$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComparisonRecorder"], {
                            onVideoRecorded: handleVideoRecorded,
                            anglesOfInterest: exercise?.anglesOfInterest,
                            exerciseName: exercise?.name,
                            enableTestMode: true
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 375,
                            columnNumber: 13
                        }, this),
                        uploadedFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Video recorded successfully!"
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 384,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: compareVideos,
                                        disabled: isAnalyzing,
                                        className: "gap-2",
                                        children: isAnalyzing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "w-4 h-4 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 25
                                                }, this),
                                                "Analyzing..."
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 25
                                                }, this),
                                                "Compare Videos"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/compare/[id]/page.tsx",
                                lineNumber: 383,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 382,
                            columnNumber: 15
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 bg-destructive/10 border border-destructive rounded-md",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-destructive",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/compare/[id]/page.tsx",
                                lineNumber: 407,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 406,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 359,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold",
                                    children: "Reference Video"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 418,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-4 bg-muted aspect-video flex items-center justify-center rounded-lg overflow-hidden",
                                    children: [
                                        videoError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-destructive p-4 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold mb-2",
                                                    children: "Video Load Error:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: videoError
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs mt-2 opacity-70",
                                                    children: [
                                                        "URL: ",
                                                        exercise.videoUrl
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 421,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                            ref: videoRef,
                                            controls: true,
                                            className: "w-full h-full object-contain rounded",
                                            crossOrigin: "anonymous",
                                            onError: (e)=>{
                                                console.error("❌ Video load error:", e);
                                                console.error("Video URL:", exercise.videoUrl);
                                                console.error("Error event:", e.currentTarget.error);
                                                setVideoError(e.currentTarget.error ? `Error ${e.currentTarget.error.code}: ${e.currentTarget.error.message}` : "Failed to load video");
                                            },
                                            onLoadedData: ()=>{
                                                console.log("Video loaded successfully");
                                                setVideoError(null);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                    src: exercise.videoUrl,
                                                    type: "video/webm"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                    src: exercise.videoUrl,
                                                    type: "video/mp4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 448,
                                                    columnNumber: 17
                                                }, this),
                                                "Your browser does not support the video tag."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 427,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 419,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 417,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold",
                                    children: "Your Video"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 457,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-4 bg-muted aspect-video flex items-center justify-center rounded-lg overflow-hidden",
                                    children: uploadedVideoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                        controls: true,
                                        className: "w-full h-full object-contain rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                src: uploadedVideoUrl,
                                                type: "video/webm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 464,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                src: uploadedVideoUrl,
                                                type: "video/mp4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 465,
                                                columnNumber: 19
                                            }, this),
                                            "Your browser does not support the video tag."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 460,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center text-muted-foreground",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                className: "w-12 h-12 mx-auto mb-2 opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 470,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Upload a video to compare"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 471,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 469,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 458,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 456,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 415,
                    columnNumber: 9
                }, this),
                comparisonResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold mb-6",
                            children: "Comparison Results"
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 482,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg font-semibold",
                                            children: "Overall Similarity"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 486,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-3xl font-bold ${comparisonResult.similarity >= 80 ? 'text-green-500' : comparisonResult.similarity >= 60 ? 'text-yellow-500' : 'text-red-500'}`,
                                            children: [
                                                comparisonResult.similarity,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 487,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 485,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full bg-muted rounded-full h-4 overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `h-full transition-all ${comparisonResult.similarity >= 80 ? 'bg-green-500' : comparisonResult.similarity >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`,
                                        style: {
                                            width: `${comparisonResult.similarity}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 495,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 494,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 484,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-4 bg-blue-50 dark:bg-blue-950/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-muted-foreground mb-1",
                                            children: "Reference Reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 509,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-3xl font-bold",
                                            children: comparisonResult.referenceReps
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 510,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 508,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-4 bg-purple-50 dark:bg-purple-950/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-muted-foreground mb-1",
                                            children: "Your Reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 513,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-3xl font-bold",
                                            children: comparisonResult.uploadedReps
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 514,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 512,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 507,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold mb-3",
                                    children: "State Accuracy"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 521,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: Object.entries(comparisonResult.details.stateMatches).map(([state, similarity])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium",
                                                                    children: state
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                                    lineNumber: 527,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: [
                                                                        Math.round(similarity),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                                    lineNumber: 528,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                                            lineNumber: 526,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full bg-muted rounded-full h-2 overflow-hidden",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `h-full ${similarity >= 80 ? 'bg-green-500' : similarity >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`,
                                                                style: {
                                                                    width: `${similarity}%`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                                lineNumber: 531,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                                            lineNumber: 530,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 525,
                                                    columnNumber: 21
                                                }, this),
                                                similarity >= 80 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    className: "w-5 h-5 text-green-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 541,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                    className: "w-5 h-5 text-red-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, state, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 524,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 522,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 520,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold mb-3",
                                    children: "Angle Deviations"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 553,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
                                    children: Object.entries(comparisonResult.details.angleDeviations).map(([angle, deviation])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            className: `p-3 ${deviation < 10 ? 'bg-green-50 dark:bg-green-950/20' : deviation < 20 ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-red-50 dark:bg-red-950/20'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-muted-foreground mb-1",
                                                    children: angle
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xl font-bold",
                                                    children: [
                                                        "±",
                                                        Math.round(deviation),
                                                        "°"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 561,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, angle, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 556,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 554,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 552,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 481,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/compare/[id]/page.tsx",
            lineNumber: 257,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/compare/[id]/page.tsx",
        lineNumber: 256,
        columnNumber: 5
    }, this);
}
_s(ComparePage, "CgBAjrNkyp6UOuuDbyEsoggw0CM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = ComparePage;
var _c;
__turbopack_context__.k.register(_c, "ComparePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_303d85a4._.js.map