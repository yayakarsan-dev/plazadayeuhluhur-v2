/* =====================================================
   PLAZA DAYEUHLUHUR
   API PRODUK V1
   CRUD Produk UMKM
   Vercel + Neon PostgreSQL
===================================================== */

import { neon } from "@neondatabase/serverless";

/* =====================================================
   DATABASE
===================================================== */

const sql = neon(process.env.DATABASE_URL);


/* =====================================================
   HEADER
===================================================== */

function json(data, status = 200) {

    return new Response(
        JSON.stringify(data),
        {
            status,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }
    );

}


/* =====================================================
   CREATE TABLE
===================================================== */

async function ensureTable() {

    await sql`
        CREATE TABLE IF NOT EXISTS produk (
            id SERIAL PRIMARY KEY,
            produk TEXT NOT NULL,
            nama TEXT,
            kategori TEXT NOT NULL,
            umkm TEXT NOT NULL,
            desa TEXT NOT NULL,
            deskripsi TEXT,
            harga TEXT,
            whatsapp TEXT,
            gambar TEXT,
            status TEXT DEFAULT 'aktif',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

}


/* =====================================================
   GET
   GET /api/produk
===================================================== */

async function getProduk() {

    const rows = await sql`
        SELECT
            id,
            produk,
            nama,
            kategori,
            umkm,
            desa,
            deskripsi,
            harga,
            whatsapp,
            gambar,
            status,
            created_at,
            updated_at
        FROM produk
        ORDER BY id ASC
    `;

    return rows;

}


/* =====================================================
   POST
   POST /api/produk
===================================================== */

async function tambahProduk(body) {

    const {

        produk,
        nama,
        kategori,
        umkm,
        desa,
        deskripsi,
        harga,
        whatsapp,
        gambar,
        status

    } = body;


    if (
        !produk ||
        !kategori ||
        !umkm ||
        !desa
    ) {

        return json(
            {
                success: false,
                message:
                    "Data wajib belum lengkap."
            },
            400
        );

    }


    const result = await sql`

        INSERT INTO produk (

            produk,
            nama,
            kategori,
            umkm,
            desa,
            deskripsi,
            harga,
            whatsapp,
            gambar,
            status

        )

        VALUES (

            ${produk},
            ${nama || produk},
            ${kategori},
            ${umkm},
            ${desa},
            ${deskripsi || ""},
            ${harga || ""},
            ${whatsapp || ""},
            ${gambar || ""},
            ${status || "aktif"}

        )

        RETURNING *

    `;


    return json(
        {
            success: true,
            message:
                "Produk berhasil disimpan.",
            data: result[0]
        },
        201
    );

}


/* =====================================================
   PUT
   PUT /api/produk?id=1
===================================================== */

async function updateProduk(
    body,
    id
) {

    if (!id) {

        return json(
            {
                success: false,
                message:
                    "ID produk tidak ditemukan."
            },
            400
        );

    }


    const {

        produk,
        nama,
        kategori,
        umkm,
        desa,
        deskripsi,
        harga,
        whatsapp,
        gambar,
        status

    } = body;


    if (
        !produk ||
        !kategori ||
        !umkm ||
        !desa
    ) {

        return json(
            {
                success: false,
                message:
                    "Data wajib belum lengkap."
            },
            400
        );

    }


    const result = await sql`

        UPDATE produk

        SET

            produk = ${produk},

            nama = ${nama || produk},

            kategori = ${kategori},

            umkm = ${umkm},

            desa = ${desa},

            deskripsi = ${deskripsi || ""},

            harga = ${harga || ""},

            whatsapp = ${whatsapp || ""},

            gambar = ${gambar || ""},

            status = ${status || "aktif"},

            updated_at = CURRENT_TIMESTAMP

        WHERE id = ${Number(id)}

        RETURNING *

    `;


    if (!result.length) {

        return json(
            {
                success: false,
                message:
                    "Produk tidak ditemukan."
            },
            404
        );

    }


    return json(
        {
            success: true,
            message:
                "Produk berhasil diperbarui.",
            data: result[0]
        }
    );

}


/* =====================================================
   DELETE
   DELETE /api/produk?id=1
===================================================== */

async function hapusProduk(id) {

    if (!id) {

        return json(
            {
                success: false,
                message:
                    "ID produk tidak ditemukan."
            },
            400
        );

    }


    const result = await sql`

        DELETE FROM produk

        WHERE id = ${Number(id)}

        RETURNING *

    `;


    if (!result.length) {

        return json(
            {
                success: false,
                message:
                    "Produk tidak ditemukan."
            },
            404
        );

    }


    return json(
        {
            success: true,
            message:
                "Produk berhasil dihapus.",
            data: result[0]
        }
    );

}


/* =====================================================
   MAIN API HANDLER
===================================================== */

export default async function handler(req) {

    try {

        /* ---------------------------------------------
           Cek DATABASE_URL
        --------------------------------------------- */

        if (!process.env.DATABASE_URL) {

            return json(
                {
                    success: false,
                    message:
                        "DATABASE_URL belum dikonfigurasi di Vercel."
                },
                500
            );

        }


        /* ---------------------------------------------
           Pastikan tabel tersedia
        --------------------------------------------- */

        await ensureTable();


        /* ---------------------------------------------
           METHOD
        --------------------------------------------- */

        const method =
            req.method ||
            "GET";


        /* ---------------------------------------------
           GET
        --------------------------------------------- */

        if (
            method === "GET"
        ) {

            const data =
                await getProduk();


            return json(
                {
                    success: true,
                    total: data.length,
                    data: data
                }
            );

        }


        /* ---------------------------------------------
           POST
        --------------------------------------------- */

        if (
            method === "POST"
        ) {

            const body =
                await req.json();


            return await tambahProduk(
                body
            );

        }


        /* ---------------------------------------------
           PUT
        --------------------------------------------- */

        if (
            method === "PUT"
        ) {

            const url =
                new URL(
                    req.url
                );


            const id =
                url.searchParams.get(
                    "id"
                );


            const body =
                await req.json();


            return await updateProduk(
                body,
                id
            );

        }


        /* ---------------------------------------------
           DELETE
        --------------------------------------------- */

        if (
            method === "DELETE"
        ) {

            const url =
                new URL(
                    req.url
                );


            const id =
                url.searchParams.get(
                    "id"
                );


            return await hapusProduk(
                id
            );

        }


        /* ---------------------------------------------
           METHOD TIDAK DIDUKUNG
        --------------------------------------------- */

        return json(
            {
                success: false,
                message:
                    "Method tidak didukung."
            },
            405
        );


    } catch (error) {

        console.error(
            "API PRODUK ERROR:",
            error
        );


        return json(
            {
                success: false,
                message:
                    "Terjadi kesalahan pada server.",
                error:
                    error.message
            },
            500
        );

    }

}