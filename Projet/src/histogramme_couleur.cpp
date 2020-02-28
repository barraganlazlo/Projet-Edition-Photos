#include "image_ppm.h"
#include <stdio.h>
#include <iostream>
#include <fstream>

using namespace std;

int main(int argc, char **argv){
    int nH, nW, nTaille;
    if (argc != 3) 
    {
        printf("Usage: ImageIn.ppm fichierOut.dat\n"); 
        return 1;
    }

    char cNomImgLue[250];
    char BufferOut[250];

    sscanf (argv[1],"%s",cNomImgLue);
    sscanf (argv[2],"%s",BufferOut);    
    OCTET *ImgIn;
    lire_nb_lignes_colonnes_image_ppm(cNomImgLue, &nH, &nW);
    nTaille = nH * nW;
    
    int nTaille3 = nTaille * 3;
    allocation_tableau(ImgIn, OCTET, nTaille3);
    lire_image_ppm(cNomImgLue, ImgIn,nTaille);
    ofstream fileOut(BufferOut);
    int occr[256];
    int occv[256];
    int occb[256];
    for(int i=0; i<256; i++){
        occr[i]=0;
        occv[i]=0;
        occb[i]=0;
    }
    for (int i=0; i < nH; i++)
    {
        for (int j=0; j < nW; j++)
        {
            occr[ImgIn[i*nW*3+j*3]]+=1;
            occv[ImgIn[i*nW*3+j*3 +1]]+=1;
            occb[ImgIn[i*nW*3+j*3 +2]]+=1;
        }
    }
    for(int i=0; i<256; i++){
        fileOut<<i<<" "<< (int) occr[i]<<" "<< (int) occv[i]<<" "<< (int) occb[i]<<endl;
    }
    return 0;   
}