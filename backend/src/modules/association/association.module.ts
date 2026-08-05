import { Module } from "@nestjs/common";
import { AssociationController } from "./association.controller";
@Module({ controllers: [AssociationController] }) export class AssociationModule {}
