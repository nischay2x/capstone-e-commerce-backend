PGDMP     9    (                |            capstone    15.3    15.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                        0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            !           1262    19620    capstone    DATABASE     �   CREATE DATABASE capstone WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE capstone;
                postgres    false            �            1259    19648    User    TABLE     �  CREATE TABLE public."User" (
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
    DROP TABLE public."User";
       public         heap    postgres    false            �            1259    19647    User_id_seq    SEQUENCE     �   CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."User_id_seq";
       public          postgres    false    216            "           0    0    User_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;
          public          postgres    false    215            �           2604    19651    User id    DEFAULT     f   ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);
 8   ALTER TABLE public."User" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216                      0    19648    User 
   TABLE DATA           �   COPY public."User" (id, "createdAt", "updatedAt", email, password, name, role, "cartId", suspended, image, verified) FROM stdin;
    public          postgres    false    216   n       #           0    0    User_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."User_id_seq"', 7, true);
          public          postgres    false    215            �           2606    19658    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public            postgres    false    216            �           1259    19699    User_cartId_key    INDEX     O   CREATE UNIQUE INDEX "User_cartId_key" ON public."User" USING btree ("cartId");
 %   DROP INDEX public."User_cartId_key";
       public            postgres    false    216            �           1259    19698    User_email_key    INDEX     K   CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);
 $   DROP INDEX public."User_email_key";
       public            postgres    false    216            �           2606    19702    User User_cartId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 C   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_cartId_fkey";
       public          postgres    false    216               �  x�u��n�6������ )R�|�`+�Y6��]o(�j���d���i�%�,�&��O�����;�x�	6���>}�ǲC�J��d�����v����a�*��T`�ڱgC�@�$I��˜�2\R%�Ku��������=�����v��IXd�J�u�El�:��a%;ɥ�j���8��o=��Ö�?��[h�˧���J�C@vНy�Do��px|�ߋ�.�4��A�d5�0��)��J(BK��S|�&�<�J��E$���=�F���J˱��4����=۪�j�KN<�AxT�E�tA����	H��K���O��|{�]y��¸Y7���?����^I�Y�k��J��Hy6���GI�#Mn���&���Lj�FC��C��+��Y�xh�$Hi�F���6�@oܦ���%�U�V%؏p����@�=�7��G��ׯ-���^�����t��z�<����������AV�=�=��*e����Sڄ�r��{?�B���m�ٳY��sLBX�m6��#�a>�.j�3ш	�9�X��a�Ϯ��b
<M!�nBZ��x��Ƹ����gj���5���ю0vMu�~z�����s4}^��y{��K^��#������ܿ�_���x�% 4ar"��g�E��&�S���h3�`�Q5u��
��b�U��!1Y3>���C���4r�1;aR�\g�L���@��a��,�h�ӂG�������9q�~@�?>mWWW�-Y�     