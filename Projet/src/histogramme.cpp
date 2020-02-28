#include "image_ppm.h"
#include <stdio.h>
#include <iostream>
#include <fstream>

using namespace std;

int main(int argc, char **argv){
    int nH, nW, nTaille;
    if (argc != 3) 
    {
        printf("Usage: ImageIn.pgm fichierOut.dat\n"); 
        return 1;
    }

    char cNomImgLue[250];
    char BufferOut[250];

    sscanf (argv[1],"%s",cNomImgLue);
    sscanf (argv[2],"%s",BufferOut);    
    OCTET *ImgIn;
    lire_nb_lignes_colonnes_image_pgm(cNomImgLue, &nH, &nW);
    nTaille = nH * nW;
    allocation_tableau(ImgIn, OCTET, nTaille);
    lire_image_pgm(cNomImgLue, ImgIn, nTaille);
    ofstream fileOut(BufferOut);
    int occ[256];
    for(int i=0; i<256; i++){
        occ[i]=0;
    }
    for (int i=0; i < nH; i++)
    {
        for (int j=0; j < nW; j++)
        {
            occ[ImgIn[i*nW+j]]+=1;
        }
    }
    for(int i=0; i<256; i++){
        fileOut<<i <<" "<< (int) occ[i]<<endl;
    }
    return 0;   
}