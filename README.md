npm install

npm start

Implementacija igre clovek ne jezi se z websocketi.

Tehnologije:
MongoDB, node.js, express, ejs, mvc

Odpri http://localhost:3000 v 4 oknih. Prijavi se na 4 razlicne racune, lahko uporabis:

Username:1, password:1;

Username:2, password:2;

Username:3, password:3;

Username:4, password:4;

Podatki o igri se izpisujejo nad igralnim oknom, najvišje sporočilo je zadnji dogodek.

Upoarbnik lahko ko se prijavi ustvari sobo, sobo vidijo drugi uporabniki in se lahko v njo pridruzijo. Ko so v sobi štirje igralci se igra prične. Vsak igralec vrže kocko in igralec z najvišjo vrednostjo prvi meče.
Če uporabni vrže 6 lahko stopi iz boxa, če ne, je na vrsti naslednji igralec. Če uporabnik vrže 6 lahko ponovno meče. Če igralec premakne figuro na mesto, ki je že zasedeno vrže figuro iz zasedenega mesta nazaj v box.
Zmaga igralec, ki prvi postavi vse svoje figure v svoj dom.
