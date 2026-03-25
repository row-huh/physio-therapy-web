module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.4.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.1.1_@types+react@19.2.7_react@19.2.0/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
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
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
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
;
}),
"[project]/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/utils/supabase/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$2$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.86.2/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$2$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.86.2/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const createClient = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$2$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseKey);
}),
"[project]/lib/storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/supabase/client.ts [app-ssr] (ecmascript)");
;
const STORAGE_KEY = "exercise-videos";
const SUPABASE_BUCKET = "reference-videos";
function getVideos() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
}
function saveVideos(videos) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
async function saveExerciseVideo(name, videoBlob, exerciseType = "custom", learnedTemplate) {
    const id = Date.now().toString();
    console.log(`📹 Saving exercise video: ${name} (${exerciseType})`);
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
        // Create a unique filename
        const fileName = `${id}_${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm`;
        const filePath = `${exerciseType}/${fileName}`;
        console.log(`☁️ Uploading video to Supabase: ${filePath}`);
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage.from(SUPABASE_BUCKET).upload(filePath, videoBlob, {
            contentType: videoBlob.type || 'video/webm',
            cacheControl: '3600',
            upsert: false
        });
        if (uploadError) {
            console.error("❌ Supabase upload error:", uploadError);
            throw new Error(`Failed to upload video: ${uploadError.message}`);
        }
        console.log(`✅ Video uploaded to Supabase:`, uploadData);
        // Get public URL
        const { data: urlData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);
        if (!urlData?.publicUrl) {
            throw new Error("Failed to get public URL for uploaded video");
        }
        console.log(`🔗 Public URL:`, urlData.publicUrl);
        // Save metadata to localStorage
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
        console.log(`✅ Exercise video saved with ID: ${id}`);
        return video;
    } catch (err) {
        console.error("Error in saveExerciseVideo:", err);
        throw err;
    }
}
function getAllExercises() {
    const videos = getVideos();
    console.log(`📂 Retrieved ${videos.length} exercise videos from storage`);
    return videos;
}
function getExercise(id) {
    const video = getVideos().find((v)=>v.id === id);
    if (video) {
        console.log(`✅ Found exercise video: ${video.name} (${video.type})`);
    } else {
        console.warn(`⚠️ Exercise video not found: ${id}`);
    }
    return video;
}
async function deleteExercise(id) {
    const videos = getVideos();
    const videoToDelete = videos.find((v)=>v.id === id);
    if (!videoToDelete) {
        return false;
    }
    // If stored in Supabase, delete from there too
    if (videoToDelete.storedInSupabase) {
        try {
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
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
                    console.log("✅ Deleted from Supabase");
                }
            }
        } catch (err) {
            console.error("Error deleting from Supabase:", err);
        }
    }
    const filtered = videos.filter((v)=>v.id !== id);
    saveVideos(filtered);
    console.log(`🗑️ Deleted exercise video: ${id}`);
    return true;
}
function clearAllExercises() {
    localStorage.removeItem(STORAGE_KEY);
    console.log("🗑️ Cleared all exercise videos");
}
}),
"[project]/lib/pose-analyzer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeVideoForPose",
    ()=>analyzeVideoForPose
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mediapipe+tasks-vision@0.10.22-rc.20250304/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs [app-ssr] (ecmascript)");
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
        const vision = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FilesetResolver"].forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm");
        console.log("Creating PoseLandmarker...");
        const poseLandmarker = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mediapipe$2b$tasks$2d$vision$40$0$2e$10$2e$22$2d$rc$2e$20250304$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PoseLandmarker"].createFromOptions(vision, {
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
            const { learnExerciseStates } = await __turbopack_context__.A("[project]/lib/exercise-state-learner.ts [app-ssr] (ecmascript, async loader)");
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
}),
"[project]/lib/exercise-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/compare/[id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComparePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pose$2d$analyzer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pose-analyzer.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$exercise$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/exercise-config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
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
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const [exercise, setExercise] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadedFile, setUploadedFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadedVideoUrl, setUploadedVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAnalyzing, setIsAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [comparisonResult, setComparisonResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [videoError, setVideoError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const ex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getExercise"])(params.id);
        if (ex) {
            console.log("📹 Loaded exercise:", ex);
            console.log("🔗 Video URL:", ex.videoUrl);
            setExercise(ex);
        }
    }, [
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
    const compareVideos = async ()=>{
        if (!uploadedFile || !exercise) return;
        setIsAnalyzing(true);
        setError(null);
        try {
            console.log("🔍 Starting video comparison...");
            // Check if reference video already has a learned template
            let referenceTemplate;
            if (exercise.learnedTemplate) {
                console.log("✅ Using stored reference template");
                referenceTemplate = exercise.learnedTemplate;
            } else {
                console.warn("⚠️ No stored template found, analyzing reference video...");
                const referenceBlob = await fetch(exercise.videoUrl).then((r)=>r.blob());
                const referenceAnalysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pose$2d$analyzer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analyzeVideoForPose"])(referenceBlob, undefined, {
                    name: exercise.name,
                    type: exercise.type
                });
                if (!referenceAnalysis.learnedTemplate) {
                    throw new Error("Failed to learn reference exercise template");
                }
                referenceTemplate = referenceAnalysis.learnedTemplate;
            }
            // Analyze uploaded video
            console.log("📹 Analyzing uploaded video...");
            // Get the exercise config to get angles of interest
            const exerciseConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$exercise$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getExerciseConfig"])(exercise.type);
            const anglesOfInterest = exerciseConfig?.anglesOfInterest;
            console.log(`Exercise type: ${exercise.type}`);
            console.log(`Exercise config:`, exerciseConfig);
            console.log(`Using angles of interest:`, anglesOfInterest);
            if (!anglesOfInterest || anglesOfInterest.length === 0) {
                console.warn("⚠️ No angles of interest found, template learning may not work");
            }
            const uploadedAnalysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pose$2d$analyzer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analyzeVideoForPose"])(uploadedFile, anglesOfInterest, {
                name: exercise.name,
                type: exercise.type
            });
            console.log("Uploaded analysis result:", uploadedAnalysis);
            console.log("Has learned template?", !!uploadedAnalysis.learnedTemplate);
            if (!uploadedAnalysis.learnedTemplate) {
                throw new Error(`Failed to learn uploaded exercise template. Video may be too short or no valid poses detected. Joint angles found: ${uploadedAnalysis.jointAngles.length}`);
            }
            // Compare the two templates
            console.log("📊 Comparing templates...");
            const comparison = compareTemplates(referenceTemplate, uploadedAnalysis.learnedTemplate);
            setComparisonResult(comparison);
            console.log("✅ Comparison complete:", comparison);
        } catch (err) {
            console.error("❌ Error comparing videos:", err);
            setError(err instanceof Error ? err.message : "Failed to compare videos");
        } finally{
            setIsAnalyzing(false);
        }
    };
    const compareTemplates = (reference, uploaded)=>{
        // Compare state matches
        const stateMatches = {};
        const angleDeviations = {};
        // For each state in reference, find closest match in uploaded
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
        // Calculate angle deviations for each angle across all states
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
        // Calculate overall similarity (0-100)
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
            // Convert angle difference to similarity (0-100)
            return Math.max(0, 100 - diff / 180 * 100);
        });
        return similarities.reduce((a, b)=>a + b, 0) / similarities.length;
    };
    if (!exercise) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "min-h-screen bg-background p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "Exercise not found"
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                className: "mt-4",
                                children: "Back Home"
                            }, void 0, false, {
                                fileName: "[project]/app/compare/[id]/page.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 218,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/compare/[id]/page.tsx",
                lineNumber: 217,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/compare/[id]/page.tsx",
            lineNumber: 216,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-background p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 234,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/compare/[id]/page.tsx",
                        lineNumber: 233,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 232,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold mb-2",
                            children: [
                                "Compare Videos - ",
                                exercise.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "Upload a video to compare against the reference exercise"
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 240,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 238,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold mb-4",
                            children: "Upload Video for Comparison"
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                    ref: fileInputRef,
                                    type: "file",
                                    accept: "video/*",
                                    onChange: handleFileUpload,
                                    className: "flex-1"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, this),
                                uploadedFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: compareVideos,
                                    disabled: isAnalyzing,
                                    className: "gap-2",
                                    children: isAnalyzing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 262,
                                                columnNumber: 21
                                            }, this),
                                            "Analyzing..."
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 267,
                                                columnNumber: 21
                                            }, this),
                                            "Compare Videos"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 255,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-3 bg-destructive/10 border border-destructive rounded-md",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-destructive",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/compare/[id]/page.tsx",
                                lineNumber: 276,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 244,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold",
                                    children: "Reference Video"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 285,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-4 bg-muted aspect-video flex items-center justify-center rounded-lg overflow-hidden",
                                    children: [
                                        videoError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-destructive p-4 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold mb-2",
                                                    children: "Video Load Error:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 289,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: videoError
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs mt-2 opacity-70",
                                                    children: [
                                                        "URL: ",
                                                        exercise.videoUrl
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 288,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
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
                                                console.log("✅ Video loaded successfully");
                                                setVideoError(null);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                    src: exercise.videoUrl,
                                                    type: "video/webm"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 314,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                    src: exercise.videoUrl,
                                                    type: "video/mp4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 17
                                                }, this),
                                                "Your browser does not support the video tag."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 294,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 284,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold",
                                    children: "Your Video"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 323,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-4 bg-muted aspect-video flex items-center justify-center rounded-lg overflow-hidden",
                                    children: uploadedVideoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                        controls: true,
                                        className: "w-full h-full object-contain rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                src: uploadedVideoUrl,
                                                type: "video/webm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 330,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                src: uploadedVideoUrl,
                                                type: "video/mp4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 331,
                                                columnNumber: 19
                                            }, this),
                                            "Your browser does not support the video tag."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 326,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center text-muted-foreground",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                className: "w-12 h-12 mx-auto mb-2 opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Upload a video to compare"
                                            }, void 0, false, {
                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                lineNumber: 337,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 335,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 324,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 322,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 282,
                    columnNumber: 9
                }, this),
                comparisonResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold mb-6",
                            children: "Comparison Results"
                        }, void 0, false, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 347,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg font-semibold",
                                            children: "Overall Similarity"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 352,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-3xl font-bold ${comparisonResult.similarity >= 80 ? 'text-green-500' : comparisonResult.similarity >= 60 ? 'text-yellow-500' : 'text-red-500'}`,
                                            children: [
                                                comparisonResult.similarity,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 353,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 351,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full bg-muted rounded-full h-4 overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `h-full transition-all ${comparisonResult.similarity >= 80 ? 'bg-green-500' : comparisonResult.similarity >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`,
                                        style: {
                                            width: `${comparisonResult.similarity}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/[id]/page.tsx",
                                        lineNumber: 362,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 361,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 350,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-4 bg-blue-50 dark:bg-blue-950/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-muted-foreground mb-1",
                                            children: "Reference Reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 376,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-3xl font-bold",
                                            children: comparisonResult.referenceReps
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 377,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 375,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-4 bg-purple-50 dark:bg-purple-950/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-muted-foreground mb-1",
                                            children: "Your Reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 380,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-3xl font-bold",
                                            children: comparisonResult.uploadedReps
                                        }, void 0, false, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 381,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 379,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 374,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold mb-3",
                                    children: "State Accuracy"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 387,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: Object.entries(comparisonResult.details.stateMatches).map(([state, similarity])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium",
                                                                    children: state
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                                    lineNumber: 393,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: [
                                                                        Math.round(similarity),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full bg-muted rounded-full h-2 overflow-hidden",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `h-full ${similarity >= 80 ? 'bg-green-500' : similarity >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`,
                                                                style: {
                                                                    width: `${similarity}%`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/compare/[id]/page.tsx",
                                                                lineNumber: 397,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                                            lineNumber: 396,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 21
                                                }, this),
                                                similarity >= 80 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    className: "w-5 h-5 text-green-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                    className: "w-5 h-5 text-red-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 410,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, state, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 390,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 388,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 386,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold mb-3",
                                    children: "Angle Deviations"
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 419,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
                                    children: Object.entries(comparisonResult.details.angleDeviations).map(([angle, deviation])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            className: `p-3 ${deviation < 10 ? 'bg-green-50 dark:bg-green-950/20' : deviation < 20 ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-red-50 dark:bg-red-950/20'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-muted-foreground mb-1",
                                                    children: angle
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 427,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xl font-bold",
                                                    children: [
                                                        "±",
                                                        Math.round(deviation),
                                                        "°"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                                    lineNumber: 428,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, angle, true, {
                                            fileName: "[project]/app/compare/[id]/page.tsx",
                                            lineNumber: 422,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/[id]/page.tsx",
                                    lineNumber: 420,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/compare/[id]/page.tsx",
                            lineNumber: 418,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/compare/[id]/page.tsx",
                    lineNumber: 346,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/compare/[id]/page.tsx",
            lineNumber: 231,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/compare/[id]/page.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__22721230._.js.map