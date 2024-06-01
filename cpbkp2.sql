--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2024-06-01 13:45:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 19621)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 854 (class 1247 OID 19640)
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'CANCELLED',
    'DISPATCHED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- TOC entry 875 (class 1247 OID 20168)
-- Name: PaymentMode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMode" AS ENUM (
    'CASH',
    'UPI',
    'CARD',
    'ONLINE'
);


ALTER TYPE public."PaymentMode" OWNER TO postgres;

--
-- TOC entry 872 (class 1247 OID 20162)
-- Name: ProductState; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProductState" AS ENUM (
    'ACTIVE',
    'DELETED'
);


ALTER TYPE public."ProductState" OWNER TO postgres;

--
-- TOC entry 851 (class 1247 OID 19632)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'SELLER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 19660)
-- Name: Cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cart" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 19668)
-- Name: CartItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItem" (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "cartId" integer NOT NULL,
    "productId" integer NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19667)
-- Name: CartItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CartItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CartItem_id_seq" OWNER TO postgres;

--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 219
-- Name: CartItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CartItem_id_seq" OWNED BY public."CartItem".id;


--
-- TOC entry 217 (class 1259 OID 19659)
-- Name: Cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Cart_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Cart_id_seq" OWNER TO postgres;

--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 217
-- Name: Cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Cart_id_seq" OWNED BY public."Cart".id;


--
-- TOC entry 225 (class 1259 OID 29292)
-- Name: EmailOtp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmailOtp" (
    email text NOT NULL,
    otp text NOT NULL
);


ALTER TABLE public."EmailOtp" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 19685)
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL,
    address text NOT NULL,
    "phoneNumber" text NOT NULL,
    "netBilledAmount" double precision NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    items text NOT NULL,
    "paymentMode" public."PaymentMode" DEFAULT 'CASH'::public."PaymentMode" NOT NULL,
    "sellerId" integer NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19684)
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Order_id_seq" OWNER TO postgres;

--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 223
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- TOC entry 222 (class 1259 OID 19675)
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    "sellerId" integer NOT NULL,
    image text NOT NULL,
    state public."ProductState" DEFAULT 'ACTIVE'::public."ProductState" NOT NULL,
    category text NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 19674)
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Product_id_seq" OWNER TO postgres;

--
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 221
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- TOC entry 216 (class 1259 OID 19648)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "cartId" integer,
    suspended boolean DEFAULT false NOT NULL,
    image text,
    verified boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 19647)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 3417 (class 0 OID 0)
-- Dependencies: 215
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 214 (class 1259 OID 19622)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 3220 (class 2604 OID 19663)
-- Name: Cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart" ALTER COLUMN id SET DEFAULT nextval('public."Cart_id_seq"'::regclass);


--
-- TOC entry 3222 (class 2604 OID 19671)
-- Name: CartItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem" ALTER COLUMN id SET DEFAULT nextval('public."CartItem_id_seq"'::regclass);


--
-- TOC entry 3226 (class 2604 OID 19688)
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- TOC entry 3223 (class 2604 OID 19678)
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- TOC entry 3215 (class 2604 OID 19651)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 3398 (class 0 OID 19660)
-- Dependencies: 218
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cart" (id, "createdAt", "updatedAt") FROM stdin;
1	2024-05-05 06:38:15.035	2024-05-05 06:38:15.035
2	2024-05-12 04:58:20.494	2024-05-12 04:58:20.494
3	2024-05-12 04:58:58.358	2024-05-12 04:58:58.358
4	2024-05-31 05:44:18.57	2024-05-31 05:44:18.57
\.


--
-- TOC entry 3400 (class 0 OID 19668)
-- Dependencies: 220
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItem" (id, quantity, "cartId", "productId") FROM stdin;
\.


--
-- TOC entry 3405 (class 0 OID 29292)
-- Dependencies: 225
-- Data for Name: EmailOtp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmailOtp" (email, otp) FROM stdin;
seller@gmail.com	630904
\.


--
-- TOC entry 3404 (class 0 OID 19685)
-- Dependencies: 224
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "createdAt", "updatedAt", "userId", address, "phoneNumber", "netBilledAmount", status, items, "paymentMode", "sellerId") FROM stdin;
1	2024-05-20 04:56:22.654	2024-05-20 04:56:22.654	3	69, Patliputra Nagar, Mopka, Bilaspur - 495001	6264551788	104.97	PENDING	[{"quantity":1,"id":33,"product":{"price":49.99,"id":9,"name":"Cozy Cotton Bed Sheets","description":"Luxuriously soft and breathable cotton bed sheets. Available in various sizes and colors.","sellerId":2}},{"quantity":1,"id":34,"product":{"price":24.99,"id":10,"name":"Bamboo Cutting Board","description":"Durable and eco-friendly bamboo cutting board. Perfect for all your chopping needs.","sellerId":2}},{"quantity":1,"id":35,"product":{"price":29.99,"id":11,"name":"Ceramic Vase","description":"Elegant ceramic vase with a minimalist design. Ideal for fresh or artificial flowers.","sellerId":2}}]	CASH	2
3	2024-05-22 16:13:58.313	2024-05-24 04:22:41.058	3	Sehgal House, 32, Ashok Nagar, Balrampur, MP - 496033	6264551788	179.98	DISPATCHED	[{"quantity":2,"id":45,"product":{"price":89.99,"id":15,"name":"LED Floor Lamp","description":"Sleek LED floor lamp with adjustable brightness and a modern design. Perfect for any living space.","sellerId":2}}]	CASH	2
5	2024-05-31 05:46:34.507	2024-05-31 05:46:34.507	7	23A, Piramal Road, Andheri West, Mumbai - 325321	6324175844	1499	PENDING	[{"quantity":1,"id":50,"product":{"price":1499,"id":9,"name":"Cozy Cotton Bed Sheets","description":"Luxuriously soft and breathable cotton bed sheets. Available in various sizes and colors.","sellerId":2}}]	CASH	2
6	2024-05-31 05:52:47.005	2024-05-31 06:05:42.473	7	23A, Piramal Road, Andheri West, Mumbai - 325321	6264551788	5397	CANCELLED	[{"quantity":1,"id":51,"product":{"price":2999,"id":118,"name":"Air Fryer","description":"Large capacity air fryer for healthier frying with little to no oil.","sellerId":6}},{"quantity":2,"id":52,"product":{"price":1199,"id":33,"name":"Electric Kettle","description":"Fast-boil electric kettle with auto-shutoff and stainless steel body.","sellerId":6}}]	CASH	6
2	2024-05-22 16:13:58.313	2024-05-31 06:08:04.067	3	Sehgal House, 32, Ashok Nagar, Balrampur, MP - 496033	6264551788	99.98	DISPATCHED	[{"quantity":2,"id":46,"product":{"price":49.99,"id":35,"name":"LED Desk Lamp","description":"Dimmable LED desk lamp with touch control and USB charging port.","sellerId":6}}]	CASH	6
4	2024-05-31 05:46:34.507	2024-05-31 06:57:24.867	7	23A, Piramal Road, Andheri West, Mumbai - 325321	6324175844	7346	COMPLETED	[{"quantity":1,"id":47,"product":{"price":1049,"id":36,"name":"Fabric Storage Bins","description":"Set of 6 collapsible fabric storage bins with handles. Perfect for organizing closets and shelves.","sellerId":6}},{"quantity":2,"id":48,"product":{"price":1199,"id":116,"name":"Adjustable Laptop Stand","description":"Ergonomic adjustable laptop stand for improved posture and comfort.","sellerId":6}},{"quantity":1,"id":49,"product":{"price":3899,"id":32,"name":"Adjustable Bookshelf","description":"Modern adjustable bookshelf with multiple shelves for ample storage.","sellerId":6}}]	CASH	6
\.


--
-- TOC entry 3402 (class 0 OID 19675)
-- Dependencies: 222
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, "createdAt", "updatedAt", name, description, price, "sellerId", image, state, category) FROM stdin;
25	2024-05-19 06:41:54.884	2024-05-23 16:25:56.482	Quilted Duvet Cover	Soft and stylish quilted duvet cover, available in multiple sizes and colors.	2399	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/25.jpeg	ACTIVE	Bedding
91	2024-05-23 16:10:22.54	2024-05-23 16:43:43.962	Luxurious Bathrobe	Soft and absorbent bathrobe made from high-quality cotton. Available in multiple sizes.	2099	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/91.jpeg	ACTIVE	Bedding
92	2024-05-23 16:10:22.54	2024-05-23 16:47:40.841	Modern Wall Clock	Sleek and modern wall clock with silent movement and easy-to-read numbers.	899	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/92.jpeg	ACTIVE	Home Decor
90	2024-05-23 16:10:22.54	2024-05-23 16:47:25.812	Ceramic Dinnerware Set	12-piece ceramic dinnerware set, includes plates, bowls, and mugs. Dishwasher and microwave safe.	1799	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/90.webp	ACTIVE	Kitchen
26	2024-05-19 06:41:54.884	2024-05-23 16:25:56.467	Smart Thermostat	Energy-efficient smart thermostat with Wi-Fi connectivity and voice control compatibility.	3899	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/26.jpeg	ACTIVE	Home Appliances
14	2024-05-19 06:41:54.884	2024-05-23 16:25:56.486	Memory Foam Pillow	Contoured memory foam pillow providing excellent neck and head support for a restful sleep.	1199	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/14.webp	ACTIVE	Bedding
15	2024-05-19 06:41:54.884	2024-05-23 16:25:56.49	LED Floor Lamp	Sleek LED floor lamp with adjustable brightness and a modern design. Perfect for any living space.	2699	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/15.jpeg	ACTIVE	Lighting
17	2024-05-19 06:41:54.884	2024-05-23 16:25:56.496	Non-Stick Frying Pan	High-quality non-stick frying pan with a comfortable grip handle. Ideal for everyday cooking.	899	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/17.jpeg	ACTIVE	Kitchen
9	2024-05-19 06:41:54.884	2024-05-23 16:25:56.497	Cozy Cotton Bed Sheets	Luxuriously soft and breathable cotton bed sheets. Available in various sizes and colors.	1499	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/9.jpeg	ACTIVE	Bedding
10	2024-05-19 06:41:54.884	2024-05-23 16:25:56.499	Bamboo Cutting Board	Durable and eco-friendly bamboo cutting board. Perfect for all your chopping needs.	749	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/10.webp	ACTIVE	Kitchen
11	2024-05-19 06:41:54.884	2024-05-23 16:25:56.501	Ceramic Vase	Elegant ceramic vase with a minimalist design. Ideal for fresh or artificial flowers.	899	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/11.jpeg	ACTIVE	Home Decor
12	2024-05-19 06:41:54.884	2024-05-23 16:25:56.502	Adjustable Office Chair	Ergonomic office chair with adjustable height and lumbar support. Available in black and grey.	4499	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/12.jpeg	ACTIVE	Furniture
13	2024-05-19 06:41:54.884	2024-05-23 16:25:56.504	Stainless Steel Cookware Set	Premium 10-piece stainless steel cookware set, suitable for all stovetops including induction.	5999	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/13.jpeg	ACTIVE	Kitchen
19	2024-05-19 06:41:54.884	2024-05-23 16:25:56.506	Reclaimed Wood Coffee Table	Stylish coffee table made from reclaimed wood, adding a rustic charm to your living room.	8999	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/19.jpeg	ACTIVE	Furniture
18	2024-05-19 06:41:54.884	2024-05-23 16:25:56.507	Velvet Throw Blanket	Ultra-soft velvet throw blanket, perfect for adding warmth and style to your sofa or bed.	1799	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/18.jpeg	ACTIVE	Bedding
20	2024-05-19 06:41:54.884	2024-05-23 16:25:56.509	Aroma Diffuser	Ultrasonic aroma diffuser with multiple timer settings and LED light options. Great for aromatherapy.	1199	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/20.webp	ACTIVE	Home Decor
24	2024-05-19 06:41:54.884	2024-05-23 16:25:56.511	Marble Cheese Board	Elegant marble cheese board, perfect for serving cheese, charcuterie, and hors d'oeuvres.	1349	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/24.webp	ACTIVE	Kitchen
21	2024-05-19 06:41:54.884	2024-05-23 16:25:56.513	Chef’s Knife	Professional-grade chef’s knife with a razor-sharp stainless steel blade and ergonomic handle.	2399	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/21.jpeg	ACTIVE	Kitchen
22	2024-05-19 06:41:54.884	2024-05-23 16:25:56.515	Blackout Curtains	Energy-saving blackout curtains that block out sunlight and provide privacy. Available in various colors.	2099	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/22.webp	ACTIVE	Home Decor
23	2024-05-19 06:41:54.884	2024-05-23 16:25:56.522	Compact Air Purifier	Portable air purifier with HEPA filter, ideal for small rooms and offices.	2999	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/23.jpeg	ACTIVE	Home Appliances
28	2024-05-19 06:41:54.884	2024-05-23 16:25:56.532	Indoor Herb Garden Kit	Complete indoor herb garden kit with seeds, soil, and pots. Perfect for growing fresh herbs at home.	1049	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/28.jpeg	ACTIVE	Home Decor
27	2024-05-19 06:41:54.884	2024-05-23 16:25:56.536	Folding Step Stool	Compact and sturdy folding step stool, ideal for reaching high shelves and cabinets.	749	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/27.jpeg	ACTIVE	Home Organization
29	2024-05-22 04:21:34.445	2024-05-23 16:25:56.538	Stainless Steel Water Bottle	Double-walled stainless steel water bottle keeps beverages hot or cold for hours.	779	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/29.jpeg	ACTIVE	Kitchen
31	2024-05-22 04:21:34.445	2024-05-23 16:25:56.54	Decorative Throw Pillows	Set of 2 decorative throw pillows with removable covers. Perfect for sofas and beds.	899	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/31.jpeg	ACTIVE	Home Decor
32	2024-05-22 04:21:34.445	2024-05-23 16:25:56.542	Adjustable Bookshelf	Modern adjustable bookshelf with multiple shelves for ample storage.	3899	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/32.jpeg	ACTIVE	Furniture
33	2024-05-22 04:21:34.445	2024-05-23 16:25:56.543	Electric Kettle	Fast-boil electric kettle with auto-shutoff and stainless steel body.	1199	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/33.webp	ACTIVE	Kitchen
34	2024-05-22 04:21:34.445	2024-05-23 16:25:56.545	Weighted Blanket	Calming weighted blanket for better sleep and relaxation. Various weights available.	2399	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/34.jpeg	ACTIVE	Bedding
36	2024-05-22 04:21:34.445	2024-05-23 16:25:56.546	Fabric Storage Bins	Set of 6 collapsible fabric storage bins with handles. Perfect for organizing closets and shelves.	1049	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/36.jpeg	ACTIVE	Home Organization
89	2024-05-23 16:10:22.54	2024-05-23 16:42:58.587	Smart Plug	Wi-Fi smart plug that allows you to control devices from your phone or voice assistant.	749	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/89.jpeg	ACTIVE	Home Appliances
47	2024-05-22 04:21:34.445	2024-05-23 16:25:56.549	Electric Pressure Cooker	Multi-functional electric pressure cooker with multiple cooking modes.	2699	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/47.jpeg	ACTIVE	Kitchen
48	2024-05-22 04:21:34.445	2024-05-23 16:25:56.551	Standing Desk Converter	Adjustable standing desk converter for a healthier workspace setup.	2999	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/48.jpeg	ACTIVE	Furniture
96	2024-05-23 16:10:22.54	2024-05-23 16:44:23.689	Desk Organizer Set	5-piece desk organizer set including a tray, pen holder, and file organizer.	1049	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/96.jpeg	ACTIVE	Home Organization
44	2024-05-22 04:21:34.445	2024-05-23 16:25:56.548	Memory Foam Mattress Topper	Comfortable memory foam mattress topper for added support and softness.	2999	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/44.jpeg	ACTIVE	Bedding
95	2024-05-23 16:10:22.54	2024-05-23 16:48:01.602	Heated Blanket	Electric heated blanket with adjustable temperature settings and auto-shutoff.	2699	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/95.jpeg	ACTIVE	Bedding
99	2024-05-23 16:10:22.54	2024-05-23 16:48:53.546	Abstract Canvas Art	Large abstract canvas art to add a modern touch to your living space.	2399	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/99.jpeg	ACTIVE	Home Decor
98	2024-05-23 16:10:22.54	2024-05-23 16:44:38.774	Velvet Sofa	Elegant velvet sofa with plush cushions and a sturdy frame. Available in various colors.	17999	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/98.jpeg	ACTIVE	Furniture
38	2024-05-22 04:21:34.445	2024-05-23 16:25:56.591	Luxury Down Comforter	All-season luxury down comforter with hypoallergenic fill.	3899	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/38.jpeg	ACTIVE	Bedding
39	2024-05-22 04:21:34.445	2024-05-23 16:25:56.593	Accent Chair	Stylish accent chair with a comfortable cushioned seat. Available in multiple colors.	5999	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/39.jpeg	ACTIVE	Furniture
40	2024-05-22 04:21:34.445	2024-05-23 16:25:56.594	Wall Art Set	Set of 3 framed wall art prints. Modern and stylish designs for any room.	1799	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/40.jpeg	ACTIVE	Home Decor
42	2024-05-22 04:21:34.445	2024-05-23 16:25:56.596	Expandable Spice Rack	Expandable spice rack with 3 tiers for easy organization and access.	749	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/42.jpeg	ACTIVE	Kitchen
41	2024-05-22 04:21:34.445	2024-05-23 16:25:56.597	Smart Light Bulbs	Set of 4 smart LED light bulbs with app control and voice compatibility.	1499	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/41.jpeg	ACTIVE	Lighting
46	2024-05-22 04:21:34.445	2024-05-23 16:25:56.598	Floating Shelves	Set of 3 floating shelves for a modern and minimalist storage solution.	1349	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/46.jpeg	ACTIVE	Home Decor
45	2024-05-22 04:21:34.445	2024-05-23 16:25:56.6	Portable Blender	Compact portable blender, perfect for smoothies and shakes on the go.	1199	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/45.jpeg	ACTIVE	Kitchen
43	2024-05-22 04:21:34.445	2024-05-23 16:25:56.601	Cordless Vacuum Cleaner	Lightweight cordless vacuum cleaner with powerful suction and long battery life.	4499	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/43.jpeg	ACTIVE	Home Appliances
93	2024-05-23 16:10:22.54	2024-05-23 16:43:56.571	Standing Floor Mirror	Full-length standing floor mirror with a sturdy frame. Perfect for bedrooms and dressing rooms.	3899	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/93.jpeg	ACTIVE	Furniture
101	2024-05-23 16:10:22.54	2024-05-23 16:49:11.935	Portable Space Heater	Compact and efficient portable space heater with safety features.	1799	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/101.jpeg	ACTIVE	Home Appliances
100	2024-05-23 16:10:22.54	2024-05-23 16:44:51.901	Motion Sensor Night Light	Battery-operated motion sensor night light for hallways, bathrooms, and bedrooms.	599	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/100.webp	ACTIVE	Lighting
103	2024-05-23 16:10:22.54	2024-05-23 16:49:24.848	Non-Slip Area Rug	Stylish non-slip area rug, available in various sizes and designs.	2999	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/103.jpeg	ACTIVE	Home Decor
105	2024-05-23 16:10:22.54	2024-05-23 16:45:08.663	Stainless Steel Mixing Bowls	Set of 5 stainless steel mixing bowls with lids for all your cooking and baking needs.	1499	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/105.jpeg	ACTIVE	Kitchen
107	2024-05-23 16:10:22.54	2024-05-23 16:49:41.329	Cordless Electric Mop	Rechargeable cordless electric mop for effortless floor cleaning.	4799	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/107.jpeg	ACTIVE	Home Appliances
106	2024-05-23 16:10:22.54	2024-05-23 16:45:20.004	Comforter Set	7-piece comforter set including comforter, shams, bed skirt, and decorative pillows.	3599	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/106.jpeg	ACTIVE	Bedding
108	2024-05-23 16:10:22.54	2024-05-23 16:49:51.069	Adjustable Closet Organizer	Customizable closet organizer system with shelves, hanging rods, and drawers.	5999	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/108.jpeg	ACTIVE	Home Organization
109	2024-05-23 16:10:22.54	2024-05-23 16:50:03.719	Glass Food Storage Containers	Set of 10 glass food storage containers with airtight lids. Microwave and freezer safe.	1199	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/109.jpeg	ACTIVE	Kitchen
111	2024-05-23 16:10:22.54	2024-05-23 16:45:32.878	Macrame Wall Hanging	Handmade macrame wall hanging to add a boho touch to any room.	1049	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/111.jpeg	ACTIVE	Home Decor
113	2024-05-23 16:10:22.54	2024-05-23 16:45:55.535	Robot Vacuum Cleaner	Automated robot vacuum cleaner with Wi-Fi connectivity and app control.	6899	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/113.webp	ACTIVE	Home Appliances
110	2024-05-23 16:10:22.54	2024-05-23 16:50:15.646	Electric Fireplace	Wall-mounted electric fireplace with adjustable flame settings and remote control.	10499	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/110.jpeg	ACTIVE	Furniture
114	2024-05-23 16:10:22.54	2024-05-23 16:46:15.623	Faux Fur Throw Blanket	Ultra-soft faux fur throw blanket for warmth and style.	1799	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/114.jpeg	ACTIVE	Bedding
115	2024-05-23 16:10:22.54	2024-05-23 16:46:24.406	Granite Mortar and Pestle	Heavy-duty granite mortar and pestle for grinding and mixing spices and herbs.	899	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/115.jpeg	ACTIVE	Kitchen
117	2024-05-23 16:10:22.54	2024-05-23 16:46:43.008	LED String Lights	20-foot LED string lights with multiple modes and remote control.	899	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/117.jpeg	ACTIVE	Lighting
94	2024-05-23 16:10:22.54	2024-05-23 16:47:50.481	Silicone Baking Mat	Reusable non-stick silicone baking mat for easy and healthy cooking.	599	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/94.webp	ACTIVE	Kitchen
37	2024-05-22 04:21:34.445	2024-05-23 16:25:56.59	Cast Iron Skillet	Pre-seasoned cast iron skillet, perfect for cooking and baking.	899	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/37.jpeg	ACTIVE	Kitchen
30	2024-05-22 04:21:34.445	2024-05-23 16:25:56.604	Luxury Bath Towels	Set of 4 plush, absorbent bath towels. Available in various colors.	1379	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/30.webp	ACTIVE	Bedding
35	2024-05-22 04:21:34.445	2024-05-23 16:25:56.606	LED Desk Lamp	Dimmable LED desk lamp with touch control and USB charging port.	1499	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/35.webp	ACTIVE	Lighting
102	2024-05-23 16:10:22.54	2024-05-23 16:44:58.964	Bamboo Bath Caddy	Adjustable bamboo bath caddy with slots for books, tablets, and wine glasses.	1199	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/102.jpeg	ACTIVE	Bedding
112	2024-05-23 16:10:22.54	2024-05-23 16:45:47.194	Clip-On Desk Lamp	Flexible clip-on desk lamp with LED light and adjustable brightness.	749	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/112.jpeg	ACTIVE	Lighting
116	2024-05-23 16:10:22.54	2024-05-23 16:46:33.121	Adjustable Laptop Stand	Ergonomic adjustable laptop stand for improved posture and comfort.	1199	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/116.jpeg	ACTIVE	Home Organization
118	2024-05-23 16:10:22.54	2024-05-23 16:46:51.413	Air Fryer	Large capacity air fryer for healthier frying with little to no oil.	2999	6	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/118.jpeg	ACTIVE	Kitchen
97	2024-05-23 16:10:22.54	2024-05-23 16:48:19.398	Stainless Steel Toaster	2-slice stainless steel toaster with multiple browning settings and defrost function.	1499	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/97.jpeg	ACTIVE	Kitchen
104	2024-05-23 16:10:22.54	2024-05-23 16:49:33	Recliner Chair	Comfortable recliner chair with adjustable backrest and footrest. Ideal for living rooms.	8999	2	https://pdf-sign.s3.ap-south-1.amazonaws.com/products/104.webp	ACTIVE	Furniture
\.


--
-- TOC entry 3396 (class 0 OID 19648)
-- Dependencies: 216
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "createdAt", "updatedAt", email, password, name, role, "cartId", suspended, image, verified) FROM stdin;
3	2024-05-12 04:58:20.507	2024-05-22 04:17:07.731	randeep@gmail.com	98592cf8042e9c1c6a18fc0055ad0353:85adff1e5de53924c0826e16f59679e052510a9d221428224fe90053d406bdfde87ed1d4e546435455fc923bcad2e75af79f5bcda76e256f5979e06e9e41041f	Randeep Hudda	USER	2	f	\N	t
5	2024-05-12 05:08:44.622	2024-05-22 04:17:07.731	admin@gmail.com	e7845d47ab8655cd2842a947a0f7edf5:da92150e0573019563b86bf0c6d4957f1875567f44ce33b299dcb7b687508806a08645e8964c618f98448aec7634f84054d9a19b86e7c51a0acf06dc04302810	Admin	ADMIN	\N	f	\N	t
6	2024-05-22 04:04:48.557	2024-05-22 04:17:07.731	orsaga@gmail.com	f651493abb7cac4126da1b8c4b0ed732:12f4b19b0333f2c71d2a59b5b2d89a2e030747194a8aaa7cda7a8b50578cd14a2cb857bd070cb4bf5ed91c50c6914b95e78d56fb430507550079c947b4576d90	Orsaga Home Accessories Ltd.	SELLER	\N	f	\N	t
2	2024-05-05 11:33:31.802	2024-05-27 06:36:23.526	seller@gmail.com	347750744e6aa45ec6747352178eafbe:2e510f0c14dac58a01f32d92c5153066a7a2d9cd88f9efc817318afdee3f5209ea529b00b6746ca30eb1fcb155af030314f3be1292c6e6e6d3fe3e4e6541c839	Appario Retails Pvt. Ltd.	SELLER	\N	f	\N	t
7	2024-05-31 05:44:18.577	2024-05-31 05:44:18.577	nischay@gmail.com	7eabb4b7ca2f0f432047cf3675c69b54:262d462deaf0bf719aac1883c4efb72075b045588297e4d547af62d6ae20fe1558f6b40d0b2e85dfc21385c49f2d883a6b6ad215aec4465ba60dd1a11fac836d	Nischay Chandra	USER	4	f	\N	t
\.


--
-- TOC entry 3394 (class 0 OID 19622)
-- Dependencies: 214
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f836eb63-d2a2-4c91-acb9-42019794d030	259f41f6c2900317ed9420813104247e8ea08abf6f2fe74833ae632448b35be6	2024-05-05 12:05:31.606505+05:30	20240317044108_initial	\N	\N	2024-05-05 12:05:31.521392+05:30	1
f24e2337-c884-49f2-a86f-99d8444bb0aa	24bc892ba82a5d9fceba0fef9285db897693b590ffd2c2250f68276ae4c01ba6	2024-05-05 12:06:37.02189+05:30	20240505063636_user_image	\N	\N	2024-05-05 12:06:37.004282+05:30	1
2b47de89-fe73-4e03-a677-afa067b9f3ed	d52e79ee7ace0716ac125223c739c52ebe5d9093adeb8a0b928c45b9bc8f43e9	2024-05-13 09:26:35.084039+05:30	20240513035635_product_category	\N	\N	2024-05-13 09:26:35.076864+05:30	1
8a13d9dc-4316-436a-8e3c-1164c2c4af44	fac25dcc296dace2dde023f15ba651b6fb6a01e99962f9ca346cb10eace023b4	2024-05-22 09:37:48.41693+05:30	20240522040748_user_verification	\N	\N	2024-05-22 09:37:48.407242+05:30	1
3a777f28-8c14-4eef-8faf-9d844be7cdc2	e4109f565c52cce119d89bcf7ced9730cec63af84f328f0948c0bb8d85f33723	2024-05-24 12:26:53.725811+05:30	20240524065653_email_otp	\N	\N	2024-05-24 12:26:53.705009+05:30	1
\.


--
-- TOC entry 3418 (class 0 OID 0)
-- Dependencies: 219
-- Name: CartItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CartItem_id_seq"', 52, true);


--
-- TOC entry 3419 (class 0 OID 0)
-- Dependencies: 217
-- Name: Cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cart_id_seq"', 4, true);


--
-- TOC entry 3420 (class 0 OID 0)
-- Dependencies: 223
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 6, true);


--
-- TOC entry 3421 (class 0 OID 0)
-- Dependencies: 221
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 118, true);


--
-- TOC entry 3422 (class 0 OID 0)
-- Dependencies: 215
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 7, true);


--
-- TOC entry 3239 (class 2606 OID 19673)
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 19666)
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- TOC entry 3245 (class 2606 OID 29298)
-- Name: EmailOtp EmailOtp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmailOtp"
    ADD CONSTRAINT "EmailOtp_pkey" PRIMARY KEY (email);


--
-- TOC entry 3243 (class 2606 OID 19694)
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 19683)
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- TOC entry 3235 (class 2606 OID 19658)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 3231 (class 2606 OID 19630)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3232 (class 1259 OID 19699)
-- Name: User_cartId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_cartId_key" ON public."User" USING btree ("cartId");


--
-- TOC entry 3233 (class 1259 OID 19698)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 3247 (class 2606 OID 19707)
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3248 (class 2606 OID 19712)
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3250 (class 2606 OID 20182)
-- Name: Order Order_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3251 (class 2606 OID 19722)
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3249 (class 2606 OID 19717)
-- Name: Product Product_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3246 (class 2606 OID 19702)
-- Name: User User_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2024-06-01 13:45:20

--
-- PostgreSQL database dump complete
--

